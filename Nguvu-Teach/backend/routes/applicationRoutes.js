// ============================================
// Application Routes — "Apply Now" Form API
// File: routes/applicationRoutes.js
// Purpose: Captures and validates student application
// submissions from the "Apply Now" form
// ============================================

const express = require("express");
const router = express.Router();

// Import the Application model
const Application = require("../models/Application");

// ============================================
// POST /api/applications
// Capture a student's live submission payload,
// validate required fields, and save to database
// ============================================
router.post("/", async (req, res) => {
  try {
    const { fullName, phoneNumber, emailAddress, courseOfInterest, whyJoin } =
      req.body;

    // Manual validation for required fields
    if (!fullName || !phoneNumber || !courseOfInterest) {
      return res.status(400).json({
        message:
          "Missing required fields: fullName, phoneNumber, and courseOfInterest are mandatory",
      });
    }

    // Create new Application document from request body
    const newApplication = new Application({
      fullName,
      phoneNumber,
      emailAddress,
      courseOfInterest,
      whyJoin,
    });

    // Save to database
    const savedApplication = await newApplication.save();

    // Return success confirmation with 201 Created status
    res.status(201).json({
      message: "Application submitted successfully!",
      application: savedApplication,
    });
  } catch (error) {
    // Handle validation errors or server errors
    console.error("Error submitting application:", error.message);
    res
      .status(500)
      .json({ message: "Server error while submitting application" });
  }
});

module.exports = router;
