// ============================================
// Event Model — "Upcoming Events" Section
// File: models/Event.js
// Purpose: Defines schema for events displayed
// in the "Upcoming Events" section
// ============================================

const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    // Event title (e.g., "Open Day 2026", "Hackathon Weekend")
    title: {
      type: String,
      required: [true, "Event title is required"],
    },

    // Description of the event details and agenda
    description: {
      type: String,
      required: [true, "Event description is required"],
    },

    // Date of the event — stored as Date for flexibility
    eventDate: {
      type: Date,
      required: [true, "Event date is required"],
    },
  },
  {
    // Automatically manage createdAt & updatedAt timestamps
    timestamps: true,
  },
);

module.exports = mongoose.model("Event", EventSchema);
