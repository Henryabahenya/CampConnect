// ============================================
// Admin Account Registration Script
// File: createAdmin.js
// Purpose: Seeds the first administrator account
// into MongoDB Atlas with bcrypt-hashed credentials
// Usage: node createAdmin.js
// ============================================

require("dotenv").config();

const mongoose = require("mongoose");
const Admin = require("./models/Admin");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");

    // Remove any existing admin to avoid stale hash conflicts
    await Admin.deleteMany({ username: "admin" });
    console.log("🗑️  Cleared previous admin document (if any)");

    // Create fresh admin — pre-save hook will hash the password
    const admin = new Admin({
      username: "admin",
      password: "NguvuTeach@2024",
    });

    await admin.save();

    console.log("🎉 Admin 'admin' created with password 'NguvuTeach@2024'");
    console.log("   Hash stored:", admin.password);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
