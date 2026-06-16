// ============================================
// Centralized Error Handling Middleware
// File: middleware/errorMiddleware.js
// Purpose: Intercepts all unhandled errors and returns
// a clean, standardized JSON error response
// ============================================

/**
 * errorHandler
 * -------------
 * Global error-catching middleware that sits at the
 * bottom of the middleware chain. Catches any errors
 * thrown or passed via next(error) in route handlers.
 *
 * In development: Returns full error stack for debugging.
 * In production: Hides stack trace from client responses.
 */
const errorHandler = (err, req, res, next) => {
  // Determine status code — default to 500 if not explicitly set
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Log the full error stack to the server terminal
  console.error("❌ Error caught by global handler:");
  console.error(err.stack);

  // Respond with standardized JSON error format
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { errorHandler };
