// ============================================
// Authentication Middleware — JWT Protection Layer
// File: middleware/authMiddleware.js
// Purpose: Verifies Bearer tokens on protected routes
// and blocks unauthenticated access with 401 status
// ============================================

const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

/**
 * protectRoute
 * -------------
 * Middleware that intercepts incoming requests to protected
 * endpoints, extracts the JWT from the Authorization header,
 * verifies its integrity, and attaches the admin user to req.admin.
 *
 * If token is missing or invalid, responds with 401 Unauthorized.
 */
const protectRoute = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from "Bearer <token>" format
      token = req.headers.authorization.split(" ")[1];

      // Verify and decode the token using our secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the admin user (minus password) to the request object
      req.admin = await Admin.findById(decoded.id).select("-password");

      if (!req.admin) {
        return res.status(401).json({ message: "Admin account not found" });
      }

      // Token is valid — proceed to the next middleware/route handler
      next();
    } catch (error) {
      console.error("Auth token verification failed:", error.message);
      return res
        .status(401)
        .json({ message: "Not authorized — invalid token" });
    }
  } else {
    // No token provided at all
    return res
      .status(401)
      .json({ message: "Not authorized — no token provided" });
  }
};

module.exports = { protectRoute };
