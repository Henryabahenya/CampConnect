const Notification = require("../models/Notification");
const User = require("../models/User");

/**
 * GET /api/notifications
 * Fetch all notifications for the authenticated user, sorted newest first.
 * Sender details are auto-populated via the schema pre-find middleware.
 */
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .populate("sender", "username profilePicture")
      .populate("targetPost", "title targetSector category")
      .limit(50);

    return res.status(200).json({
      count: notifications.length,
      notifications,
    });
  } catch (err) {
    console.error("Get notifications error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * PATCH /api/notifications/:id/read
 * Mark a single notification as read.
 */
const markAsRead = async (req, res) => {
  try {
    const targetId = req.params.id;

    // Target ONLY the record matching this unique ID + authenticated user
    const result = await Notification.findOneAndUpdate(
      { _id: targetId, recipient: req.user.id },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: "Target notification not found" });
    }

    return res.status(200).json({ success: true, updatedId: result._id });
  } catch (err) {
    console.error("Mark notification read error:", err);
    return res.status(500).json({ success: false, error: "Database transaction isolation failed" });
  }
};

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications for the current user as read.
 */
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true },
    );

    return res
      .status(200)
      .json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("Mark all read error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
