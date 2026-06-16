// ============================================
// Request Logger Middleware
// File: middleware/loggerMiddleware.js
// Purpose: Logs incoming HTTP requests to the terminal
// with method, URL path, and timestamp
// ============================================

/**
 * requestLogger
 * --------------
 * Simple traffic monitoring middleware that prints
 * a formatted log entry for every incoming request.
 * Mounted at the top of the middleware chain for
 * complete request visibility.
 *
 * Output format: [YYYY-MM-DD] METHOD request made to /path
 */
const requestLogger = (req, res, next) => {
  // Generate current date in YYYY-MM-DD format
  const timestamp = new Date().toISOString().split("T")[0];

  // Print formatted request log to terminal
  console.log(
    `[${timestamp}] ${req.method} request made to ${req.originalUrl}`,
  );

  // Pass control to the next middleware in the chain
  next();
};

module.exports = { requestLogger };
