// ============================================
// Nguvu-Teach Database Seeder Script
// File: seed.js
// Purpose: Populates MongoDB Atlas collections with
// initial content data for Tracks, Courses, and Events
// Usage: node seed.js
// ============================================

// Load environment variables from .env
const dotenv = require("dotenv");
dotenv.config();

// Import database connection framework
const connectDB = require("./config/db");

// Import Mongoose data models
const Track = require("./models/Track");
const Course = require("./models/Course");
const Event = require("./models/Event");

// ============================================
// Seed Data Definitions
// ============================================

// Track entries for "What We Do" section (6 cards)
const trackData = [
  {
    title: "Website & System Management",
    description:
      "Learn to deploy, monitor, and scale enterprise web architectures securely.",
    iconIdentifier: "Globe",
  },
  {
    title: "Software Engineering",
    description:
      "Master full-stack programming paradigms using modern frameworks and tools.",
    iconIdentifier: "Code",
  },
  {
    title: "Computer Repairs & Maintenance",
    description:
      "Hands-on diagnostic training for hardware repairs and operating system optimization.",
    iconIdentifier: "Cpu",
  },
  {
    title: "Basic & Intermediate Computer Skills",
    description:
      "Build deep digital literacy competence covering standard productivity tooling suites.",
    iconIdentifier: "Monitor",
  },
  {
    title: "Digital Marketing",
    description:
      "Drive online visibility conversions through data analytics and optimization strategies.",
    iconIdentifier: "Megaphone",
  },
  {
    title: "Animation & Graphic Design",
    description:
      "Craft striking visual layouts and motion elements built to professional brand specifications.",
    iconIdentifier: "Palette",
  },
];

// Course entries for "Our Courses" section (3 cards)
const courseData = [
  {
    title: "Introduction to Web Development",
    description:
      "Build custom interactive websites from scratch using HTML, CSS, Tailwind, and React.",
    level: "Beginner",
    duration: "8 Weeks",
  },
  {
    title: "Advanced Software Engineering Pipeline",
    description:
      "Dive deep into backend API architectures, system design patterns, and database scaling layers.",
    level: "Intermediate",
    duration: "12 Weeks",
  },
  {
    title: "Digital Marketing & Analytics Essentials",
    description:
      "Master modern campaign tracking frameworks and brand positioning architectures.",
    level: "All Levels",
    duration: "6 Weeks",
  },
];

// Event entries for "Upcoming Events" section (2 cards)
const eventData = [
  {
    title: "Open Day & Registration Hub",
    description:
      "Visit our technology lab space, meet the tech instruction leads, and claim your course seat.",
    eventDate: "June 20, 2026",
  },
  {
    title: "Community Tech Hackathon",
    description:
      "Form collaborative software building teams and engineer digital solution prototypes in a weekend sprint.",
    eventDate: "July 15, 2026",
  },
];

// ============================================
// Seed Execution Function
// ============================================

const seedDatabase = async () => {
  try {
    // Step 1: Connect to MongoDB Atlas
    await connectDB();

    // Step 2: Clear existing data to prevent duplication
    await Track.deleteMany({});
    console.log("🗑️  Cleared existing Track documents");

    await Course.deleteMany({});
    console.log("🗑️  Cleared existing Course documents");

    await Event.deleteMany({});
    console.log("🗑️  Cleared existing Event documents");

    // Step 3: Insert fresh seed data into collections
    await Track.insertMany(trackData);
    console.log("✅ Inserted 6 Track documents");

    await Course.insertMany(courseData);
    console.log("✅ Inserted 3 Course documents");

    await Event.insertMany(eventData);
    console.log("✅ Inserted 2 Event documents");

    // Step 4: Log success and exit cleanly
    console.log("");
    console.log("🌱 Database seeded successfully with Nguvu-Teach content!");
    process.exit(0);
  } catch (error) {
    // Handle any errors during seeding
    console.error("❌ Seeding Error:", error.message);
    process.exit(1);
  }
};

// Execute the seeder
seedDatabase();
