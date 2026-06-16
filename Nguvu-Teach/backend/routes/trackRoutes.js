// ============================================
// Track Routes — "What We Do" Section API
// File: routes/trackRoutes.js
// Purpose: Full CRUD operations for learning tracks
// ============================================

const express = require("express");
const router = express.Router();

// Import the Track model
const Track = require("../models/Track");

// Import auth protection middleware
const { protectRoute } = require("../middleware/authMiddleware");

// ============================================
// GET /api/tracks (PUBLIC)
// Fetch and return all track items from the database
// ============================================
router.get("/", async (req, res) => {
  try {
    const tracks = await Track.find().sort({ createdAt: -1 });
    res.status(200).json(tracks);
  } catch (error) {
    console.error("Error fetching tracks:", error.message);
    res.status(500).json({ message: "Server error while fetching tracks" });
  }
});

// ============================================
// POST /api/tracks (PROTECTED — Admin Only)
// Create and save a new track item
// ============================================
router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, description, iconIdentifier } = req.body;

    const newTrack = new Track({ title, description, iconIdentifier });
    const savedTrack = await newTrack.save();

    res.status(201).json(savedTrack);
  } catch (error) {
    console.error("Error creating track:", error.message);
    res.status(400).json({ message: error.message });
  }
});

// ============================================
// PUT /api/tracks/:id (PROTECTED — Admin Only)
// Update an existing track item by ID
// ============================================
router.put("/:id", protectRoute, async (req, res) => {
  try {
    const { title, description, iconIdentifier } = req.body;

    const updatedTrack = await Track.findByIdAndUpdate(
      req.params.id,
      { title, description, iconIdentifier },
      { new: true, runValidators: true },
    );

    if (!updatedTrack) {
      return res.status(404).json({ message: "Track not found" });
    }

    res.status(200).json(updatedTrack);
  } catch (error) {
    console.error("Error updating track:", error.message);
    res.status(400).json({ message: error.message });
  }
});

// ============================================
// DELETE /api/tracks/:id (PROTECTED — Admin Only)
// Remove a track item by ID
// ============================================
router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const deletedTrack = await Track.findByIdAndDelete(req.params.id);

    if (!deletedTrack) {
      return res.status(404).json({ message: "Track not found" });
    }

    res.status(200).json({ message: "Track deleted successfully" });
  } catch (error) {
    console.error("Error deleting track:", error.message);
    res.status(500).json({ message: "Server error while deleting track" });
  }
});

module.exports = router;
