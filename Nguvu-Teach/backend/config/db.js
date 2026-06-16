// ============================================
// Nguvu-Teach Database Connection Configuration
// File: config/db.js
// Purpose: Establishes async connection to MongoDB Atlas
// ============================================

const mongoose = require("mongoose");

/**
 * connectDB
 * ---------
 * Asynchronous function that connects to MongoDB Atlas
 * using the MONGO_URI environment variable.
 * Logs success confirmation or exits gracefully on failure.
 */
const connectDB = async () => {
  try {
    // Attempt connection to MongoDB Atlas cluster
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Log successful connection with host and environment mode
    const mode = process.env.NODE_ENV || "development";
    console.log(
      `✅ MongoDB Atlas Connected — Host: ${conn.connection.host} | Mode: ${mode}`,
    );
  } catch (error) {
    // Log the error details for debugging
    console.error(`❌ MongoDB Connection Error: ${error.message}`);

    // Exit the Node process gracefully with failure code
    process.exit(1);
  }
};

module.exports = connectDB;
