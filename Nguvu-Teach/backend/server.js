const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
console.log(
  "System Status: GEMINI_API_KEY is",
  process.env.GEMINI_API_KEY ? "LOADED" : "MISSING",
);

// ============================================
// Nguvu-Teach Central Server Manager
// File: server.js
// Purpose: Unified single-process production server
// serving both the Express API and the React SPA
// from a single port binding.
//
// ROUTING ORDER IS CRITICAL:
// 1. Global middleware (CORS, JSON parser, logger)
// 2. Static asset serving (dist/) — checked FIRST for files
// 3. API route handlers (/api/*)
// 4. SPA fallback wildcard (*) — catches client-side routes
// 5. Centralized error handler — absolute bottom
// ============================================

// ============================================
// 1. IMPORTS & CORE INSTANTIATION
// ============================================

const express = require("express");
const cors = require("cors");

// Internal modules
const connectDB = require("./config/db");

// Custom middleware imports
const { requestLogger } = require("./middleware/loggerMiddleware");
const { errorHandler } = require("./middleware/errorMiddleware");

// Initialize database connection (skipped during test runs —
// test files manage their own isolated DB connections)
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

// Create Express application instance
const app = express();

// ============================================
// 2. GLOBAL NETWORK MIDDLEWARE (Top of Chain)
// ============================================
// These must be mounted first so every subsequent
// request handler benefits from parsing and logging.

// Request Logger — logs all incoming traffic with timestamps
app.use(requestLogger);

// CORS Security — reads from FRONTEND_URL env variable
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};
app.use(cors(corsOptions));

// Body Parser — parse incoming JSON payloads automatically
app.use(express.json());

// ============================================
// 3. STATIC ASSET DEPLOYMENT
// ============================================
// This MUST sit ABOVE any root or wildcard routes.
// Express will check for physical files in 'dist/' first
// (index.html, CSS bundles, JS chunks, images).
// If a matching file is found, it is served immediately
// without hitting any route handler below.

app.use(express.static(path.join(__dirname, "dist")));

// ============================================
// 4. API ENDPOINT ROUTERS
// ============================================
// All business-logic routes live under /api/* prefixes.
// Because they are mounted AFTER static serving, API calls
// are only processed if no physical file matched the request.

// Import route modules
const authRoutes = require("./routes/authRoutes");
const trackRoutes = require("./routes/trackRoutes");
const courseRoutes = require("./routes/courseRoutes");
const eventRoutes = require("./routes/eventRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const chatRouter = require("./routes/chat");

// Mount routes to their respective API paths
app.use("/api/auth", authRoutes);
app.use("/api/tracks", trackRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chat", chatRouter);

// ============================================
// 5. API HEALTH CHECK (relocated from '/' to '/api')
// ============================================
// Moved off the root path so it no longer collides with
// the React SPA's index.html served from dist/.

app.get("/api", (req, res) => {
  res.json({ status: "Nguvu-Teach API running smoothly" });
});

// ============================================
// 6. FRONTEND SPA FALLBACK WILDCARD
// ============================================
// Any request that did NOT match a static file or an /api/*
// route is a client-side navigation path (e.g., /admin-login,
// /admin-dashboard). We serve index.html and let React Router
// handle the routing on the client side.
// This MUST be placed AFTER all API routes to avoid swallowing
// legitimate API 404s with an HTML page.

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ============================================
// 7. CENTRALIZED ERROR HANDLER (Absolute Bottom)
// ============================================
// Express error-handling middleware requires 4 params (err, req, res, next).
// It must be the very last app.use() call so it catches any
// errors thrown or passed via next(err) in the chain above.

app.use(errorHandler);

// ============================================
// SERVER LISTENER BINDING
// ============================================

const PORT = process.env.PORT || 5000;

// Only start the server listener if this file is run directly.
// When imported by test files via require(), we skip app.listen()
// to prevent port collision conflicts with Supertest.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(` Nguvu-Teach Server is live on port ${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(` Serving frontend from: ${path.join(__dirname, "dist")}`);
    console.log(` CORS Origin: ${corsOptions.origin}`);
  });
}

// Export the Express app instance for Supertest integration
module.exports = app;
