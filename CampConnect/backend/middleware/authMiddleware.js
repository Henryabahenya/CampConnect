const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { redisClient } = require("../config/redis");

const protect = async function (req, res, next) {
  const header = req.header("Authorization");

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const cacheKey = `session:${decoded.id}`;

    // Attempt Redis cache hit
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      req.user = JSON.parse(cached);
    } else {
      // Cache miss — fetch from MongoDB
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const userData = user.toObject();
      userData.id = userData._id.toString();

      // Cache with 24-hour expiration (EX in seconds)
      await redisClient.set(cacheKey, JSON.stringify(userData), { EX: 86400 });

      req.user = userData;
    }

    // Ensure .id is always available (Mongoose virtual isn't preserved in JSON)
    if (!req.user.id && req.user._id) {
      req.user.id = req.user._id.toString();
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

/**
 * Optional auth middleware — attaches user if token is present, but does not
 * block unauthenticated requests. Useful for routes that enhance responses
 * for logged-in users (e.g., isNew flag) but still serve public data.
 */
const optionalAuth = async function (req, res, next) {
  const header = req.header("Authorization");

  if (!header || !header.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const cacheKey = `session:${decoded.id}`;
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      req.user = JSON.parse(cached);
    } else {
      const user = await User.findById(decoded.id).select("-password");
      if (user) {
        const userData = user.toObject();
        userData.id = userData._id.toString();
        await redisClient.set(cacheKey, JSON.stringify(userData), { EX: 86400 });
        req.user = userData;
      } else {
        req.user = null;
      }
    }

    if (req.user && !req.user.id && req.user._id) {
      req.user.id = req.user._id.toString();
    }
  } catch (err) {
    req.user = null;
  }

  next();
};

module.exports = protect;
module.exports.optionalAuth = optionalAuth;
