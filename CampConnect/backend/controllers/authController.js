const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  recordSession,
  invalidateSession,
  recordFailedLogin,
  clearFailedLogins,
  isAccountLocked,
} = require("../middleware/sessionMiddleware");

const JWT_EXPIRES_IN = "1d";
const JWT_TTL_SECONDS = 24 * 60 * 60;
const PHONE_REGEX = /^\+254\s?7\d{8}$/;

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const normalizePhone = (value) => {
  if (!value || typeof value !== "string") return null;
  return value.trim();
};

/**
 * POST /api/auth/register
 * Accepts email, phoneNumber, password, profilePicture, and hierarchical camp location.
 * Validates phone format and hashes password with bcrypt before persisting.
 */
const registerUser = async (req, res) => {
  try {
    const {
      username,
      name,
      email,
      phone,
      phoneNumber,
      password,
      profilePicture,
      location,
    } = req.body;

    const normalizedPhone = normalizePhone(phoneNumber || phone);
    if (!normalizedPhone || !PHONE_REGEX.test(normalizedPhone)) {
      return res.status(400).json({
        message:
          "Phone number must start with +254 7 followed by 8 digits (e.g., +254 768 407 749)",
      });
    }

    const normalizedEmail = email ? email.toLowerCase().trim() : null;

    const existingUser = await User.findOne({
      $or: [
        { username },
        { email: normalizedEmail },
        { phoneNumber: normalizedPhone },
      ],
    });

    if (existingUser) {
      let errorMsg = "User already exists";
      if (existingUser.email === normalizedEmail) {
        errorMsg = "This email is already registered.";
      } else if (existingUser.phoneNumber === normalizedPhone) {
        errorMsg = "This phone number is already registered.";
      } else if (existingUser.username === username) {
        errorMsg = "This username is already taken.";
      }
      return res.status(400).json({ message: errorMsg });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      username,
      name: name || username,
      email: normalizedEmail,
      phoneNumber: normalizedPhone,
      password: hashedPassword,
      profilePicture: profilePicture || "",
      avatarUrl: profilePicture || "",
      location,
    };

    const user = await User.create(userData);

    const token = signToken(user._id);
    await recordSession(user._id, token, JWT_TTL_SECONDS);

    const userObj = user.toObject({ virtuals: true });
    delete userObj.password;
    delete userObj.resetToken;
    delete userObj.resetTokenExpires;

    return res.status(201).json({ token, user: userObj });
  } catch (err) {
    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(". ") });
    }
    // Handle duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({
        message: `This ${field} is already in use. Please try another.`,
      });
    }
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/auth/login
 * Verifies credentials and issues a secure JWT token.
 * Provides specific error messages for non-existent users and wrong passwords.
 * Tracks sessions in Redis and prevents brute-force attacks.
 */
const loginUser = async (req, res) => {
  try {
    const identifier =
      req.body.email || req.body.phone || req.body.identifier || "";
    const password = req.body.password;

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Email or phone and password are required" });
    }

    const normalizedIdentifier = identifier.trim();
    const query = normalizedIdentifier.includes("@")
      ? { email: normalizedIdentifier.toLowerCase() }
      : {
          $or: [
            { email: normalizedIdentifier.toLowerCase() },
            { phoneNumber: normalizedIdentifier },
          ],
        };

    const locked = await isAccountLocked(normalizedIdentifier);
    if (locked) {
      return res.status(429).json({
        message:
          "Too many failed login attempts. Please try again later or reset your password.",
      });
    }

    const user = await User.findOne(query);
    if (!user) {
      await recordFailedLogin(normalizedIdentifier);
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    if (user.status === "Suspended") {
      return res
        .status(403)
        .json({ message: "Account suspended. Contact an administrator." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await recordFailedLogin(normalizedIdentifier);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    await clearFailedLogins(normalizedIdentifier);

    const token = signToken(user._id);
    await recordSession(user._id, token, JWT_TTL_SECONDS);

    const userObj = user.toObject({ virtuals: true });
    delete userObj.password;
    delete userObj.resetToken;
    delete userObj.resetTokenExpires;

    return res.status(200).json({ token, user: userObj });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/auth/forgot-password
 * Generates a 6-digit verification code, saves it with a 15-minute expiry,
 * and logs a simulated email dispatch to the console.
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Return success even if user not found (security best practice)
      return res.status(200).json({
        message:
          "If an account with that email exists, a verification code has been sent.",
      });
    }

    // Generate a 6-digit verification token
    const resetCode = crypto.randomInt(100000, 999999).toString();

    // Hash the code before storing (security layer)
    const hashedCode = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    // Save to user with 15-minute expiration
    user.resetToken = hashedCode;
    user.resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await user.save({ validateBeforeSave: false });

    // Simulate email dispatch (replace with real email service in production)
    console.log("═══════════════════════════════════════════════════════");
    console.log("  📧 PASSWORD RESET EMAIL SIMULATION");
    console.log("═══════════════════════════════════════════════════════");
    console.log(`  To:      ${user.email}`);
    console.log(`  Subject: CampConnect Password Reset`);
    console.log(`  Code:    ${resetCode}`);
    console.log(`  Expires: ${user.resetTokenExpires.toISOString()}`);
    console.log("═══════════════════════════════════════════════════════");

    return res.status(200).json({
      message:
        "If an account with that email exists, a verification code has been sent.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/auth/reset-password
 * Accepts { email, code, newPassword } and resets the password
 * if the code is valid and not expired.
 */
const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({
        message: "Email, verification code, and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    // Hash the provided code to compare with stored hash
    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

    const user = await User.findOne({
      email,
      resetToken: hashedCode,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code" });
    }

    // Hash new password and save
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear reset token fields
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save({ validateBeforeSave: false });

    console.log(`[Auth] Password reset successful for: ${user.email}`);

    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT /api/auth/profile
 * Update the authenticated user's profile. Supports optional Multer image upload.
 */
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // --- Rate limiting: max 3 profile edits per 30 days ---
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    user.profileEditTimestamps = (user.profileEditTimestamps || []).filter(
      (ts) => new Date(ts) > thirtyDaysAgo,
    );

    if (user.profileEditTimestamps.length >= 3) {
      return res.status(423).json({
        message:
          "Profile edit lock active. You can only update your profile details 3 times every 30 days.",
      });
    }

    user.profileEditTimestamps.push(new Date());

    // Updatable text fields
    const {
      username,
      bio,
      campSystem,
      sector,
      zone,
      block,
      village,
      neighborhood,
      compound,
      houseNumber,
    } = req.body;
    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;

    // Hierarchical camp location — only update fields that are explicitly provided
    if (campSystem !== undefined) user.location.campSystem = campSystem;
    if (sector !== undefined) user.location.sector = sector;
    if (zone !== undefined) user.location.specificLocation.zone = zone;
    if (block !== undefined) user.location.specificLocation.block = block;
    if (village !== undefined)
      user.location.specificLocation.neighborhood = village;
    if (neighborhood !== undefined)
      user.location.specificLocation.neighborhood = neighborhood;
    if (compound !== undefined)
      user.location.specificLocation.compound = compound;
    if (houseNumber !== undefined)
      user.location.specificLocation.houseNumber = houseNumber;

    // Optional Multer file upload — only overwrite if a file was sent
    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`;
    }

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.resetToken;
    delete userObj.resetTokenExpires;

    return res.status(200).json(userObj);
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(". ") });
    }
    console.error("Update profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/auth/logout
 * Invalidates the user session stored in Redis.
 */
const logoutUser = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Invalidate session in Redis
    await invalidateSession(userId);

    // Clear token from localStorage (client-side instruction)
    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/auth/me
 * Returns the currently authenticated user (from auth middleware)
 */
const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    return res.status(200).json(user);
  } catch (err) {
    console.error("Get current user error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  updateProfile,
};
