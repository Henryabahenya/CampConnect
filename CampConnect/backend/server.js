const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const path = require("path");
const fs = require("fs");
const { connectRedis } = require("./config/redis");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const alertRoutes = require("./routes/alertRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const configRoutes = require("./routes/configRoutes");
const layoutRoutes = require("./routes/layoutRoutes");

const app = express();

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

// Restrictive CORS for production while allowing localhost during development
const allowedOrigins = [
  process.env.FRONTEND_PRODUCTION_URL,
  "http://localhost:5173",
].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Blocked by security production CORS policy"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

if (process.env.NODE_ENV !== "test") {
  // Only sanitize requests with bodies (POST, PUT, PATCH, DELETE)
  // to avoid issues with read-only req.query in Express 5+
  app.use((req, res, next) => {
    if (
      (req.path === "/api" || req.path.startsWith("/api/")) &&
      ["POST", "PUT", "PATCH", "DELETE"].includes(req.method)
    ) {
      return mongoSanitize()(req, res, next);
    }
    next();
  });
}

// Allow cross-origin loading of public assets like favicon from localhost frontend
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

// Serve uploaded files
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  }),
);

// Serve frontend static files if the build exists
const frontendDistPath = path.join(__dirname, "dist");
if (fs.existsSync(frontendDistPath)) {
  app.use(
    express.static(frontendDistPath, {
      setHeaders: (res) => {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      },
    }),
  );
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
});
app.use("/api", limiter);

// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Redis connection
if (process.env.NODE_ENV !== "test") {
  connectRedis()
    .then(() => console.log("Redis ready"))
    .catch((err) => console.error("Redis startup error:", err));
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", authRoutes); // Exposes GET /api/users/:id public profile
app.use("/api/alerts", alertRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/config", configRoutes);
app.use("/api/layout", layoutRoutes);

// Handle favicon requests explicitly to avoid SPA fallback serving HTML
const faviconPath = path.join(__dirname, "dist", "favicon.ico");
if (fs.existsSync(faviconPath)) {
  app.get("/favicon.ico", (req, res) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.sendFile(faviconPath);
  });
} else {
  app.get("/favicon.ico", (req, res) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.status(204).end();
  });
}

// Serve SPA fallback for any non-API route when dist is available
if (fs.existsSync(path.join(__dirname, "dist", "index.html"))) {
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (process.env.NODE_ENV === "production") {
    return res.status(500).json({ message: "Internal Server Error" });
  }

  return res.status(500).json({ message: err.message, stack: err.stack });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
