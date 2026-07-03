const mongoose = require("mongoose");

// --- Location sub-document schema ---
const specificLocationSchema = new mongoose.Schema(
  {
    zone: { type: String, trim: true, default: "" },
    block: { type: String, trim: true, default: "" },
    neighborhood: { type: String, trim: true, default: "" },
    compound: { type: String, trim: true, default: "" },
    houseNumber: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

const locationSchema = new mongoose.Schema(
  {
    campSystem: {
      type: String,
      enum: ["Kakuma", "Kalobeyei", "Outside Camp"],
      required: [true, "Camp system is required"],
    },
    sector: {
      type: String,
      enum: [
        "Kakuma 1",
        "Kakuma 2",
        "Kakuma 3",
        "Kakuma 4",
        "Village 1",
        "Village 2",
        "Village 3",
        "None",
      ],
      required: [true, "Sector is required"],
    },
    specificLocation: {
      type: specificLocationSchema,
      default: () => ({}),
    },
  },
  { _id: false },
);

// --- Main User schema ---
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      match: [
        /^\+254\s?7\d{8}$/,
        "Phone number must start with +254 7 followed by 8 digits (e.g., +254 768 407 749)",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    profilePicture: {
      type: String,
      default:
        "https://ui-avatars.com/api/?name=User&background=1e3a5f&color=fff",
    },
    role: {
      type: String,
      enum: ["resident", "moderator", "admin"],
      default: "resident",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },
    location: {
      type: locationSchema,
      required: [true, "Location is required"],
    },
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpires: {
      type: Date,
      default: null,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [150, "Bio cannot exceed 150 characters"],
      default: "",
    },
    profileEditTimestamps: {
      type: [Date],
      default: [],
    },
  },
  { timestamps: true },
);

// --- Location validation: enforce sector matches campSystem ---
userSchema.pre("validate", function () {
  if (!this.location) return;

  const { campSystem, sector } = this.location;

  const kakumaSectors = ["Kakuma 1", "Kakuma 2", "Kakuma 3", "Kakuma 4"];
  const kalobeyeiSectors = ["Village 1", "Village 2", "Village 3"];

  if (campSystem === "Kakuma" && !kakumaSectors.includes(sector)) {
    this.invalidate(
      "location.sector",
      `For Kakuma camp system, sector must be one of: ${kakumaSectors.join(", ")}`,
    );
  }

  if (campSystem === "Kalobeyei" && !kalobeyeiSectors.includes(sector)) {
    this.invalidate(
      "location.sector",
      `For Kalobeyei camp system, sector must be one of: ${kalobeyeiSectors.join(", ")}`,
    );
  }

  if (campSystem === "Outside Camp" && sector !== "None") {
    this.invalidate(
      "location.sector",
      'For Outside Camp, sector must be "None"',
    );
  }
});

module.exports = mongoose.model("User", userSchema);
