const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Alert title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Alert description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Security",
        "Water",
        "Electricity",
        "Health",
        "Shelter",
        "Food",
        "Lost/Found",
        "General",
      ],
    },
    urgency: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    locationDetails: {
      type: String,
      required: [true, "Location details are required"],
    },
    targetSector: {
      type: String,
      required: [true, "Target sector is required for geo-fenced alerts"],
      enum: [
        "Kakuma 1",
        "Kakuma 2",
        "Kakuma 3",
        "Kakuma 4",
        "Village 1",
        "Village 2",
        "Village 3",
        "All",
      ],
      default: "All",
    },
    image: {
      type: String,
      default: null,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Alert must have an author"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        postedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    views: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    seenBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual: viewCount
alertSchema.virtual("viewCount").get(function () {
  return this.views ? this.views.length : 0;
});

// Index for efficient sector-based feed queries
alertSchema.index({ targetSector: 1, createdAt: -1 });

module.exports = mongoose.model("Alert", alertSchema);
