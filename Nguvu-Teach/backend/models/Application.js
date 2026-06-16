// ============================================
// Application Model — "Apply Now" Form Captures
// File: models/Application.js
// Purpose: Stores student application submissions
// from the "Apply Now" form
// ============================================

const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    // Full name of the applicant
    fullName: {
      type: String,
      required: [true, "Full name is required"],
    },

    // Phone number for primary contact
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },

    // Email address (optional contact method)
    emailAddress: {
      type: String,
      required: false,
    },

    // The course the applicant wants to enroll in
    courseOfInterest: {
      type: String,
      required: [true, "Course of interest is required"],
    },

    // Motivation statement (optional)
    whyJoin: {
      type: String,
      required: false,
    },

    // Timestamp when the application was submitted
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Automatically manage createdAt & updatedAt timestamps
    timestamps: true,
  },
);

module.exports = mongoose.model("Application", ApplicationSchema);
