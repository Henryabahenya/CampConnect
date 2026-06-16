// ============================================
// Admin Account Seeder Script
// File: seedAdmin.js
// Purpose: Creates the initial admin account in MongoDB
// Usage: node seedAdmin.js
// ============================================

const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const Admin = require("./models/Admin");

const seedAdmin = async () => {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");

    // Check if an admin already exists
    const existingAdmin = await Admin.findOne({ username: "admin" });
    if (existingAdmin) {
      console.log("⚠️  Admin account already exists — skipping seed.");
      process.exit(0);
    }

    // Create the default admin account
    // Password will be automatically hashed by the pre-save hook
    const admin = new Admin({
      username: "admin",
      password: "NguvuAdmin2026",
    });

    await admin.save();
    console.log("🔐 Admin account created successfully!");
    console.log("   Username: admin");
    console.log("   Password: NguvuAdmin2026");
    console.log("   ⚠️  Change this password in production!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
