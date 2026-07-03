const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recipient is required"],
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender is required"],
    },
    type: {
      type: String,
      required: [true, "Notification type is required"],
      enum: {
        values: ["POST_UPLOAD", "COMMENT_REPLY", "TAG_MENTION"],
        message: "{VALUE} is not a valid notification type",
      },
    },
    sector: {
      type: String,
      required: [true, "Sector is required for frontend routing"],
      enum: [
        "Kakuma 1",
        "Kakuma 2",
        "Kakuma 3",
        "Kakuma 4",
        "Village 1",
        "Village 2",
        "Village 3",
      ],
    },
    targetPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alert",
      required: [true, "Target post reference is required"],
    },
    targetComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index for efficient queries: unread notifications per user, sorted by date
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

// Pre-find middleware to auto-populate sender details on all queries
notificationSchema.pre(/^find/, function (next) {
  this.populate({
    path: "sender",
    select: "username profilePicture",
  });
  next();
});

// Virtual field to expose sender's display name conveniently
notificationSchema.virtual("senderName").get(function () {
  return this.sender?.username || null;
});

// Virtual field to expose sender's avatar URL
notificationSchema.virtual("senderAvatar").get(function () {
  return this.sender?.profilePicture || null;
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
