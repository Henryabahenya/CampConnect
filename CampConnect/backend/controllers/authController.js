const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * POST /api/auth/register
 * Accepts email, phone, password, profilePicture, and full hierarchical camp location.
 * Hashes password with bcrypt before persisting.
 */
const registerUser = async (req, res) => {
  try {
    const { username, email, phone, password, profilePicture, location } =
      req.body;

    // Check for existing user by username, email, or phone
    const existingUser = await User.findOne({
      $or: [{ username }, { email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password securely
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      username,
      email,
      phone,
      password: hashedPassword,
      location,
    };

    // Optional profile picture
    if (profilePicture) {
      userData.profilePicture = profilePicture;
    }

    const user = await User.create(userData);

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    const userObj = user.toObject();
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
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/auth/login
 * Verifies credentials and issues a secure JWT token.
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check account status
    if (user.status === "Suspended") {
      return res
        .status(403)
        .json({ message: "Account suspended. Contact an administrator." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    const userObj = user.toObject();
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

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updateProfile,
};
