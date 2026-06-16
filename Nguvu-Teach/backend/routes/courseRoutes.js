// ============================================
// Course Routes — "Our Courses" Section API
// File: routes/courseRoutes.js
// Purpose: Full CRUD operations for courses
// ============================================

const express = require("express");
const router = express.Router();

// Import the Course model
const Course = require("../models/Course");

// Import auth protection middleware
const { protectRoute } = require("../middleware/authMiddleware");

// ============================================
// GET /api/courses (PUBLIC)
// Fetch and return all courses from the database
// ============================================
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error.message);
    res.status(500).json({ message: "Server error while fetching courses" });
  }
});

// ============================================
// POST /api/courses (PROTECTED — Admin Only)
// Create and save a new course item
// ============================================
router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, description, level, duration } = req.body;

    const newCourse = new Course({ title, description, level, duration });
    const savedCourse = await newCourse.save();

    res.status(201).json(savedCourse);
  } catch (error) {
    console.error("Error creating course:", error.message);
    res.status(400).json({ message: error.message });
  }
});

// ============================================
// PUT /api/courses/:id (PROTECTED — Admin Only)
// Update an existing course by ID
// ============================================
router.put("/:id", protectRoute, async (req, res) => {
  try {
    const { title, description, level, duration } = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, level, duration },
      { new: true, runValidators: true },
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error.message);
    res.status(400).json({ message: error.message });
  }
});

// ============================================
// DELETE /api/courses/:id (PROTECTED — Admin Only)
// Remove a course by ID
// ============================================
router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error.message);
    res.status(500).json({ message: "Server error while deleting course" });
  }
});

module.exports = router;
