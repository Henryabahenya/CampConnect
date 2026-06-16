// ============================================
// Message Model — "Contact Us" Form Submissions
// File: models/Message.js
// Purpose: Stores contact form messages submitted
// through the "Contact Us" section
// ============================================

const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    // Sender's name
    name: {
      type: String,
      required: [true, "Name is required"],
    },

    // Sender's email address
    email: {
      type: String,
      required: [true, "Email is required"],
    },

    // Message subject line
    subject: {
      type: String,
      required: [true, "Subject is required"],
    },

    // Full message body content
    message: {
      type: String,
      required: [true, "Message body is required"],
    },

    // Timestamp when the message was created
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Automatically manage updatedAt timestamp
    timestamps: true,
  },
);

module.exports = mongoose.model("Message", MessageSchema);
