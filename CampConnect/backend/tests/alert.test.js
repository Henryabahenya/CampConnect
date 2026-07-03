const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = require("../server");
const User = require("../models/User");
const Alert = require("../models/Alert");
const { redisClient } = require("../config/redis");

jest.setTimeout(15000);

let token;

beforeAll(async () => {
  // Connect to Redis if not already open
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URI);
  }
  await User.deleteMany({});
  await Alert.deleteMany({});

  const bcrypt = require("bcryptjs");
  const hashedPassword = await bcrypt.hash("Test@1234", 10);

  const user = await User.create({
    username: "alerttester",
    email: "alerttester@example.com",
    phone: "0798765432",
    password: hashedPassword,
    location: {
      campSystem: "Kakuma",
      sector: "Kakuma 1",
      specificLocation: { zone: "Zone 3", block: "Block B" },
    },
  });

  token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // Pre-seed Redis session so the auth middleware gets a cache hit
  const userObj = user.toObject();
  delete userObj.password;
  userObj.id = user._id.toString();
  await redisClient.set(`session:${user._id}`, JSON.stringify(userObj));
});

afterAll(async () => {
  await User.deleteMany({});
  await Alert.deleteMany({});
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  // Clean up Redis connection
  if (redisClient.isOpen) {
    await redisClient.quit();
  }
});

describe("GET /api/alerts", () => {
  // Seed an alert first so the GET tests have data to verify
  beforeAll(async () => {
    await request(app)
      .post("/api/alerts")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Seeded Alert",
        description: "Pre-seeded alert for GET test verification",
        category: "Water",
        urgency: "Medium",
        locationDetails: "Zone 3, Block B",
        targetSector: "Kakuma 1",
        image: "https://campconnect.io/uploads/water-issue.jpg",
      });
  });

  it("should return 200 and a structured response with alerts array", async () => {
    const res = await request(app)
      .get("/api/alerts")
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("alerts");
    expect(Array.isArray(res.body.alerts)).toBe(true);
    expect(res.body).toHaveProperty("count");

    // Verify postedBy is populated (object with profile data, not raw ID)
    const firstAlert = res.body.alerts[0];
    expect(firstAlert).toHaveProperty("postedBy");
    expect(typeof firstAlert.postedBy).toBe("object");
    expect(firstAlert.postedBy).toHaveProperty("username");
    expect(firstAlert.postedBy).toHaveProperty("profilePicture");
  });

  it("should filter alerts by sector query param", async () => {
    const res = await request(app)
      .get("/api/alerts?sector=Kakuma+1")
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("sector", "Kakuma 1");
    expect(Array.isArray(res.body.alerts)).toBe(true);
  });
});

describe("POST /api/alerts", () => {
  const alertPayload = {
    title: "Water Outage",
    description: "No water supply in Zone 3 since morning",
    category: "Water",
    urgency: "High",
    locationDetails: "Block B, Zone 3",
    targetSector: "Kakuma 1",
    image: "https://campconnect.io/uploads/broken-pipe.jpg",
  };

  it("should create an alert when authenticated", async () => {
    const res = await request(app)
      .post("/api/alerts")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(alertPayload);

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("title", "Water Outage");
    expect(res.body).toHaveProperty("category", "Water");
    expect(res.body).toHaveProperty("targetSector", "Kakuma 1");
    expect(res.body).toHaveProperty(
      "image",
      "https://campconnect.io/uploads/broken-pipe.jpg",
    );
    expect(res.body).toHaveProperty("postedBy");
    // postedBy should be populated with profile info (not a raw ObjectId string)
    expect(typeof res.body.postedBy).toBe("object");
    expect(res.body.postedBy).toHaveProperty("username", "alerttester");
    expect(res.body.postedBy).toHaveProperty("profilePicture");
  });

  it("should create an alert without an image (optional field)", async () => {
    const payloadNoImage = {
      ...alertPayload,
      title: "Power Cut",
      category: "Electricity",
    };
    delete payloadNoImage.image;

    const res = await request(app)
      .post("/api/alerts")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(payloadNoImage);

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("title", "Power Cut");
    expect(res.body.image).toBeNull();
  });

  it("should return 401 when no token is provided", async () => {
    const res = await request(app)
      .post("/api/alerts")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(alertPayload);

    expect(res.statusCode).toBe(401);
  });
});
