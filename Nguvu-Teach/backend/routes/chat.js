// ============================================
// Nguvu-Teach AI Chat Router
// File: routes/chat.js
// Purpose: Provides a POST endpoint that relays
// user messages to Google Gemini AI with strict
// platform-only context guardrails.
//
// MOUNTING IN server.js:
//   const chatRouter = require("./routes/chat");
//   app.use("/api/chat", chatRouter);
// ============================================

const express = require("express");
const router = express.Router();
const { GoogleGenAI } = require("@google/genai");

// Boot-time verification log
console.log(
  "[Chat System Boot] Verification - Is GEMINI_API_KEY detected?:",
  !!process.env.GEMINI_API_KEY,
);

// Initialize the AI client (key already loaded by dotenv in server.js)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post("/", async (req, res) => {
  try {
    // Explicit security guard
    if (!process.env.GEMINI_API_KEY) {
      console.error(
        "[Chat API Error] Execution blocked: process.env.GEMINI_API_KEY is undefined inside the route context.",
      );
      return res.status(500).json({
        reply:
          "Server configuration issue: AI Identity key missing. Please check your backend .env file setup.",
      });
    }

    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        reply: "Please type a message so I can help you.",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction:
          "You are the Nguvu-Teach Support Assistant. Only answer questions about Nguvu-Teach courses, tracks, and application forms. Politely decline all other topics.",
      },
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error("Chat API Error:", error.message);
    res.status(500).json({
      reply:
        "I'm having a connection hiccup. Please try again or contact support.",
    });
  }
});

module.exports = router;
module.exports = router;
