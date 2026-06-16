// ============================================
// Authentication Routes — Admin Login API
// File: routes/authRoutes.js
// Purpose: Handles admin login and JWT generation
// ============================================

const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Import the Admin model
const Admin = require("../models/Admin");

/**
 * generateToken
 * Generates a signed JWT with the admin's ID as payload.
 * Token expires in 7 days.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ============================================
// POST /api/auth/login
// Validates admin credentials and returns a JWT
// ============================================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input fields exist
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    // Find admin by username
    const admin = await Admin.findOne({ username: username.toLowerCase() });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare submitted password against stored hash
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Credentials valid — generate and return JWT
    const token = generateToken(admin._id);

    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error during authentication" });
  }
});

module.exports = router;
