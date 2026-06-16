// ============================================
// Course Model — "Our Courses" Section
// File: models/Course.js
// Purpose: Defines schema for courses displayed
// in the "Our Courses" section
// ============================================

const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    // Course title (e.g., "Introduction to JavaScript")
    title: {
      type: String,
      required: [true, "Course title is required"],
    },

    // Detailed description of course content
    description: {
      type: String,
      required: [true, "Course description is required"],
    },

    // Difficulty level with controlled vocabulary
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "All Levels"],
      default: "Beginner",
    },

    // Duration of the course (e.g., "6 weeks", "3 months")
    duration: {
      type: String,
      required: [true, "Course duration is required"],
    },
  },
  {
    // Automatically manage createdAt & updatedAt timestamps
    timestamps: true,
  },
);

module.exports = mongoose.model("Course", CourseSchema);
