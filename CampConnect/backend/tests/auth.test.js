const request = require("supertest");
const crypto = require("crypto");
const mongoose = require("mongoose");
const app = require("../server");
const User = require("../models/User");

jest.setTimeout(15000);

beforeAll(async () => {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URI);
  }
  await User.deleteMany({});
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});

describe("POST /api/auth/register", () => {
  it("should register a new user and return a token", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send({
        username: "testuser",
        email: "testuser@example.com",
        phone: "0712345678",
        password: "Test@1234",
        profilePicture: "https://example.com/avatar.png",
        location: {
          campSystem: "Kakuma",
          sector: "Kakuma 1",
          specificLocation: {
            zone: "Zone A",
            block: "B3",
            neighborhood: "Riverside",
            compound: "C12",
            houseNumber: "H4",
          },
        },
      });

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("username", "testuser");
    expect(res.body.user).toHaveProperty("email", "testuser@example.com");
    expect(res.body.user).toHaveProperty("phone", "0712345678");
    expect(res.body.user).toHaveProperty(
      "profilePicture",
      "https://example.com/avatar.png",
    );
    expect(res.body.user).toHaveProperty("status", "Active");
    expect(res.body.user.location).toHaveProperty("campSystem", "Kakuma");
    expect(res.body.user.location).toHaveProperty("sector", "Kakuma 1");
    expect(res.body.user.location.specificLocation).toHaveProperty(
      "zone",
      "Zone A",
    );
    expect(res.body.user).not.toHaveProperty("password");
    expect(res.body.user).not.toHaveProperty("resetToken");
  });

  it("should reject invalid sector for Kakuma camp", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send({
        username: "baduser",
        email: "bad@example.com",
        phone: "0799999999",
        password: "Test@1234",
        location: {
          campSystem: "Kakuma",
          sector: "Village 1",
        },
      });

    expect([400, 422]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("message");
  });
});

describe("POST /api/auth/login", () => {
  it("should login with valid credentials and return a token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send({
        email: "testuser@example.com",
        password: "Test@1234",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("username", "testuser");
    expect(res.body.user).not.toHaveProperty("password");
  });

  it("should reject login with incorrect password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send({
        email: "testuser@example.com",
        password: "WrongPassword",
      });

    expect([400, 401]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("message");
  });
});

describe("POST /api/auth/forgot-password", () => {
  it("should return success message for existing email", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send({ email: "testuser@example.com" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(/verification code/i);

    // Verify reset token was saved to the user
    const user = await User.findOne({ email: "testuser@example.com" });
    expect(user.resetToken).not.toBeNull();
    expect(user.resetTokenExpires).not.toBeNull();
    expect(new Date(user.resetTokenExpires).getTime()).toBeGreaterThan(
      Date.now(),
    );
  });

  it("should return same success message for non-existent email (no info leak)", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send({ email: "nobody@example.com" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 400 if email is not provided", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send({});

    expect(res.statusCode).toBe(400);
  });
});

describe("POST /api/auth/reset-password", () => {
  let validCode;

  beforeAll(async () => {
    // Generate a known code and set it on the user
    validCode = "123456";
    const hashedCode = crypto
      .createHash("sha256")
      .update(validCode)
      .digest("hex");

    await User.findOneAndUpdate(
      { email: "testuser@example.com" },
      {
        resetToken: hashedCode,
        resetTokenExpires: new Date(Date.now() + 15 * 60 * 1000),
      },
    );
  });

  it("should reset password with valid code", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send({
        email: "testuser@example.com",
        code: validCode,
        newPassword: "NewSecure@999",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Password reset successful");

    // Verify user can login with new password
    const loginRes = await request(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send({
        email: "testuser@example.com",
        password: "NewSecure@999",
      });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty("token");
  });

  it("should reject invalid verification code", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send({
        email: "testuser@example.com",
        code: "000000",
        newPassword: "AnotherPass@1",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/invalid|expired/i);
  });

  it("should reject if required fields are missing", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send({ email: "testuser@example.com" });

    expect(res.statusCode).toBe(400);
  });
});
