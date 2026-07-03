const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config({ path: __dirname + "/../.env" });

async function run() {
  if (process.env.NODE_ENV === "production") {
    console.error(
      "Refusing to run destructive cleanup in production environment",
    );
    process.exit(1);
  }

  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set in .env");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  try {
    const result = await User.deleteMany({ role: { $ne: "admin" } });
    console.log(`Deleted ${result.deletedCount} non-admin user(s)`);
  } catch (err) {
    console.error("Error deleting users:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
