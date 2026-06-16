// ============================================
// Nguvu-Teach API Integration Test Suite
// File: tests/api.test.js
// Purpose: Automated endpoint testing using Jest + Supertest
// against an isolated test database instance
// ============================================

// CRITICAL: Load environment variables FIRST with explicit path resolution.
// Jest runs from the project root, but we ensure the .env path is absolute
// to prevent MONGO_URI from resolving to undefined.
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const request = require("supertest");
const mongoose = require("mongoose");

// Set NODE_ENV to 'test' so server.js skips its own DB connection
process.env.NODE_ENV = "test";

// ============================================
// Mock External Services (Nodemailer Stub)
// ============================================
// Intercepts any future email utility imports so that running
// automated tests verifies database integration but never
// triggers real SMTP transmissions to external inboxes.

jest.mock(
  "../config/email",
  () => ({
    sendEmail: jest.fn().mockResolvedValue({ messageId: "mock-email-id" }),
    transporter: {
      sendMail: jest.fn().mockResolvedValue({ accepted: ["test@test.com"] }),
    },
  }),
  { virtual: true }
);

// ============================================
// Import the Express App (without starting listener)
// ============================================
const app = require("../server");

// Import models for direct DB verification
const Course = require("../models/Course");
const Application = require("../models/Application");
const Message = require("../models/Message");

// ============================================
// Database Connection URI (with fallback)
// ============================================
// Build the test database URI. If MONGO_URI loaded correctly from .env,
// replace the production DB name with a test-specific one.
// If .env failed to load, fall back to a local MongoDB instance.
const TEST_DB_URI = process.env.MONGO_URI
  ? process.env.MONGO_URI.replace("/nguvuteach", "/nguvuteach_test")
  : "mongodb://127.0.0.1:27017/nguvuteach_test";

// ============================================
// Global Lifecycle Hooks
// ============================================

/**
 * beforeAll — Establishes a dedicated test database connection.
 * Only connects if Mongoose is not already connected (readyState === 0).
 * Uses a 20-second timeout to accommodate Atlas cold starts.
 */
beforeAll(async () => {
  // Only open a new connection if one isn't already active
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_DB_URI, {
      serverSelectionTimeoutMS: 15000, // Wait up to 15s for Atlas to respond
      socketTimeoutMS: 20000,          // Close sockets after 20s of inactivity
    });
  }
  console.log("🧪 Connected to test database: nguvuteach_test");
}, 20000); // Jest hook timeout: 20 seconds

/**
 * afterAll — Cleans up test data and closes the database connection.
 * Drops all documents from test collections, then disconnects
 * so Jest exits cleanly without lingering TCP socket handles.
 */
afterAll(async () => {
  try {
    // Clean all documents from test collections
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
    console.log("🧹 Test collections cleaned");
  } catch (err) {
    console.error("Warning: Error during test cleanup:", err.message);
  }

  // Disconnect Mongoose to release all socket handles
  await mongoose.disconnect();
  console.log("🔌 Mongoose disconnected — test run complete");
}, 15000); // Jest hook timeout: 15 seconds

// ============================================
// TEST SUITE A: GET /api/courses
// Verifies course retrieval endpoint functionality
// ============================================

describe("GET /api/courses", () => {
  // Seed test courses before this suite runs
  beforeAll(async () => {
    await Course.insertMany([
      {
        title: "Test Course: Web Dev Basics",
        description: "HTML, CSS, and JavaScript fundamentals.",
        level: "Beginner",
        duration: "8 Weeks",
      },
      {
        title: "Test Course: Advanced Node.js",
        description: "Backend API design and database scaling.",
        level: "Intermediate",
        duration: "12 Weeks",
      },
    ]);
  });

  it("should return HTTP status 200", async () => {
    const res = await request(app).get("/api/courses");

    expect(res.statusCode).toBe(200);
  });

  it("should return a valid JSON array of courses", async () => {
    const res = await request(app).get("/api/courses");

    // Response body should be an array
    expect(Array.isArray(res.body)).toBe(true);

    // Should contain at least our 2 seeded test courses
    expect(res.body.length).toBeGreaterThanOrEqual(2);

    // Each course should have the expected schema fields
    const course = res.body[0];
    expect(course).toHaveProperty("title");
    expect(course).toHaveProperty("description");
    expect(course).toHaveProperty("level");
    expect(course).toHaveProperty("duration");
  });
});

// ============================================
// TEST SUITE B: POST /api/applications
// Verifies form validation and successful ingestion
// ============================================

describe("POST /api/applications", () => {
  // ---- Test Case 1: Success Path ----
  it("should accept a valid application and return 201", async () => {
    const validPayload = {
      fullName: "Jane Muthoni",
      phoneNumber: "+254712345678",
      emailAddress: "jane@example.com",
      courseOfInterest: "Web Development",
      whyJoin: "I want to build websites for local businesses.",
    };

    const res = await request(app)
      .post("/api/applications")
      .send(validPayload)
      .set("Content-Type", "application/json");

    // Should return 201 Created
    expect(res.statusCode).toBe(201);

    // Response should contain success message
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(/successfully/i);

    // Verify the record was actually stored in the database
    const storedApplication = await Application.findOne({
      phoneNumber: "+254712345678",
    });
    expect(storedApplication).not.toBeNull();
    expect(storedApplication.fullName).toBe("Jane Muthoni");
    expect(storedApplication.courseOfInterest).toBe("Web Development");
  });

  // ---- Test Case 2: Validation Failure Path ----
  it("should reject a payload missing required 'phoneNumber' with 400", async () => {
    const invalidPayload = {
      fullName: "Incomplete Applicant",
      // phoneNumber is intentionally missing
      courseOfInterest: "Digital Marketing",
    };

    const res = await request(app)
      .post("/api/applications")
      .send(invalidPayload)
      .set("Content-Type", "application/json");

    // Should return 400 Bad Request
    expect(res.statusCode).toBe(400);

    // Response should contain a descriptive error message
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(/required|missing|phoneNumber/i);

    // Verify no broken record was stored
    const storedApplication = await Application.findOne({
      fullName: "Incomplete Applicant",
    });
    expect(storedApplication).toBeNull();
  });
});

// ============================================
// TEST SUITE C: POST /api/messages
// Verifies contact form submission and storage
// ============================================

describe("POST /api/messages", () => {
  it("should accept a valid contact message and return 201", async () => {
    const validMessage = {
      name: "John Kamau",
      email: "john.kamau@example.com",
      subject: "Partnership Inquiry",
      message:
        "I would like to discuss a collaboration opportunity with Nguvu-Teach.",
    };

    const res = await request(app)
      .post("/api/messages")
      .send(validMessage)
      .set("Content-Type", "application/json");

    // Should return 201 Created
    expect(res.statusCode).toBe(201);

    // Response should confirm receipt
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(/success/i);

    // Verify the document was stored in the database
    const storedMessage = await Message.findOne({
      email: "john.kamau@example.com",
    });
    expect(storedMessage).not.toBeNull();
    expect(storedMessage.name).toBe("John Kamau");
    expect(storedMessage.subject).toBe("Partnership Inquiry");
  });

  it("should reject a message missing required fields with 400", async () => {
    const invalidMessage = {
      name: "Missing Fields User",
      // email, subject, and message are missing
    };

    const res = await request(app)
      .post("/api/messages")
      .send(invalidMessage)
      .set("Content-Type", "application/json");

    // Should return 400 Bad Request
    expect(res.statusCode).toBe(400);

    // Should return a descriptive error
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(/required|missing|mandatory/i);
  });
});
