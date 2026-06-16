// ============================================
// Track Model — "What We Do" Section
// File: models/Track.js
// Purpose: Defines schema for learning tracks/pathways
// displayed in the "What We Do" section
// ============================================

const mongoose = require("mongoose");

const TrackSchema = new mongoose.Schema(
  {
    // Track title (e.g., "Web Development", "Data Science")
    title: {
      type: String,
      required: [true, "Track title is required"],
    },

    // Brief description of the learning track
    description: {
      type: String,
      required: [true, "Track description is required"],
    },

    // Icon identifier string for frontend icon rendering
    // (e.g., "FaCode", "FaDatabase", "FaPaintBrush")
    iconIdentifier: {
      type: String,
      required: [true, "Icon identifier is required"],
    },
  },
  {
    // Automatically manage createdAt & updatedAt timestamps
    timestamps: true,
  },
);

module.exports = mongoose.model("Track", TrackSchema);
