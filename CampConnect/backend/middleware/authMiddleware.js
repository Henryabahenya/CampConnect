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
    const tokenKey = `token:${decoded.id}`;

    if (!redisClient) {
      return res
        .status(503)
        .json({ message: "Authentication service unavailable" });
    }

    const whitelistedToken = await redisClient.get(tokenKey);
    if (!whitelistedToken || whitelistedToken !== token) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const sessionKey = `session:${decoded.id}`;
    const cached = await redisClient.get(sessionKey);

    if (cached) {
      req.user = JSON.parse(cached);
    } else {
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const userData = user.toObject();
      userData.id = userData._id.toString();
      await redisClient.set(sessionKey, JSON.stringify(userData), {
        EX: 86400,
      });
      req.user = userData;
    }

    if (!req.user.id && req.user._id) {
      req.user.id = req.user._id.toString();
    }

    return next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

const optionalAuth = async function (req, res, next) {
  const header = req.header("Authorization");

  if (!header || !header.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const tokenKey = `token:${decoded.id}`;

    if (!redisClient) {
      req.user = null;
      return next();
    }

    const whitelistedToken = await redisClient.get(tokenKey);
    if (!whitelistedToken || whitelistedToken !== token) {
      req.user = null;
      return next();
    }

    const sessionKey = `session:${decoded.id}`;
    const cached = await redisClient.get(sessionKey);

    if (cached) {
      req.user = JSON.parse(cached);
    } else {
      const user = await User.findById(decoded.id).select("-password");
      if (user) {
        const userData = user.toObject();
        userData.id = userData._id.toString();
        await redisClient.set(sessionKey, JSON.stringify(userData), {
          EX: 86400,
        });
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
