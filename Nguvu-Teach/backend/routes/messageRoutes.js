// ============================================
// Message Routes — "Contact Us" Form API
// File: routes/messageRoutes.js
// Purpose: Captures and validates contact form
// submissions from the "Contact Us" section
// ============================================

const express = require("express");
const router = express.Router();

// Import the Message model
const Message = require("../models/Message");

// ============================================
// POST /api/messages
// Capture a user's contact message, validate
// all required fields, and save to database
// ============================================
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Manual validation for all required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message:
          "Missing required fields: name, email, subject, and message are all mandatory",
      });
    }

    // Create new Message document from request body
    const newMessage = new Message({
      name,
      email,
      subject,
      message,
    });

    // Save to database
    const savedMessage = await newMessage.save();

    // Return success confirmation with 201 Created status
    res.status(201).json({
      message: "Message sent successfully! We will get back to you soon.",
      data: savedMessage,
    });
  } catch (error) {
    // Handle validation errors or server errors
    console.error("Error sending message:", error.message);
    res.status(500).json({ message: "Server error while sending message" });
  }
});

module.exports = router;
