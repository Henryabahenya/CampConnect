// ============================================
// Event Routes — "Upcoming Events" Section API
// File: routes/eventRoutes.js
// Purpose: Full CRUD operations for events
// ============================================

const express = require("express");
const router = express.Router();

// Import the Event model
const Event = require("../models/Event");

// Import auth protection middleware
const { protectRoute } = require("../middleware/authMiddleware");

// ============================================
// GET /api/events (PUBLIC)
// Fetch and return all upcoming events from the database
// ============================================
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ eventDate: 1 });
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error.message);
    res.status(500).json({ message: "Server error while fetching events" });
  }
});

// ============================================
// POST /api/events (PROTECTED — Admin Only)
// Create and save a new event item
// ============================================
router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, description, eventDate } = req.body;

    const newEvent = new Event({ title, description, eventDate });
    const savedEvent = await newEvent.save();

    res.status(201).json(savedEvent);
  } catch (error) {
    console.error("Error creating event:", error.message);
    res.status(400).json({ message: error.message });
  }
});

// ============================================
// PUT /api/events/:id (PROTECTED — Admin Only)
// Update an existing event by ID
// ============================================
router.put("/:id", protectRoute, async (req, res) => {
  try {
    const { title, description, eventDate } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, eventDate },
      { new: true, runValidators: true },
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error.message);
    res.status(400).json({ message: error.message });
  }
});

// ============================================
// DELETE /api/events/:id (PROTECTED — Admin Only)
// Remove an event by ID
// ============================================
router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error.message);
    res.status(500).json({ message: "Server error while deleting event" });
  }
});

module.exports = router;
