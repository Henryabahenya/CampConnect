const Alert = require("../models/Alert");
const Notification = require("../models/Notification");
const User = require("../models/User");

/**
 * POST /api/alerts
 * Create a new geo-fenced community alert.
 */
const createAlert = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      urgency,
      locationDetails,
      targetSector,
      image,
    } = req.body;

    const alert = await Alert.create({
      title,
      description,
      category,
      urgency,
      locationDetails,
      targetSector: targetSector || "All",
      image: image || null,
      postedBy: req.user.id,
    });

    // Populate the author before returning
    const populated = await alert.populate({
      path: "postedBy",
      select: "username profilePicture location.sector",
    });

    // Dispatch POST_UPLOAD notifications to all users in the target sector
    try {
      const sectorResidents = await User.find({
        "location.sector": alert.targetSector,
        _id: { $ne: req.user.id },
        status: "Active",
      }).select("_id");

      if (sectorResidents.length > 0) {
        const notificationDocs = sectorResidents.map((resident) => ({
          recipient: resident._id,
          sender: req.user.id,
          type: "POST_UPLOAD",
          sector: alert.targetSector,
          targetPost: alert._id,
        }));
        await Notification.insertMany(notificationDocs);
      }
    } catch (notifErr) {
      console.error("Post notification dispatch error:", notifErr);
      // Non-blocking: don't fail the response if notifications fail
    }

    return res.status(201).json(populated);
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(". ") });
    }
    console.error("Create alert error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/alerts
 * Localized feed: prioritizes alerts matching ?sector= query param.
 * Returns sector-specific alerts first, then remaining alerts as fallback.
 * If no sector param is provided, returns all alerts sorted by newest.
 * Computes `isNew` boolean per post based on seenBy array when user is authenticated.
 */
const getAllAlerts = async (req, res) => {
  try {
    const { sector } = req.query;
    const userId = req.user?.id || null;

    const populateOptions = {
      path: "postedBy",
      select: "username profilePicture location.sector",
    };

    // Helper: attach isNew flag based on seenBy
    const attachIsNew = (alertDoc) => {
      const obj = alertDoc.toObject({ virtuals: true });
      if (userId) {
        obj.isNew = !obj.seenBy?.some(
          (id) => id.toString() === userId.toString()
        );
      } else {
        obj.isNew = false;
      }
      // Remove seenBy from response payload to save bandwidth
      delete obj.seenBy;
      return obj;
    };

    if (sector) {
      // Fetch sector-specific alerts and global "All" alerts in parallel
      const [sectorAlerts, otherAlerts] = await Promise.all([
        Alert.find({ targetSector: { $in: [sector, "All"] } })
          .populate(populateOptions)
          .sort({ createdAt: -1 }),
        Alert.find({ targetSector: { $nin: [sector, "All"] } })
          .populate(populateOptions)
          .sort({ createdAt: -1 }),
      ]);

      const allAlerts = [...sectorAlerts, ...otherAlerts].map(attachIsNew);

      // Sector-relevant alerts first, then others as fallback
      return res.status(200).json({
        sector,
        count: allAlerts.length,
        alerts: allAlerts,
      });
    }

    // No sector filter — return all alerts
    const alerts = await Alert.find()
      .populate(populateOptions)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      sector: null,
      count: alerts.length,
      alerts: alerts.map(attachIsNew),
    });
  } catch (err) {
    console.error("Get alerts error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/alerts/:id
 * Fetch a single alert by ID and track unique views.
 */
const getAlertById = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    // Track unique view: only add if user hasn't viewed before
    const userId = req.user.id;
    if (!alert.views.some((id) => id.toString() === userId)) {
      await Alert.findByIdAndUpdate(req.params.id, {
        $addToSet: { views: userId },
      });
      alert.views.push(userId);
    }

    // Populate author, comment authors, and viewers
    await alert.populate([
      { path: "postedBy", select: "username profilePicture location.sector" },
      {
        path: "comments.postedBy",
        select: "username profilePicture location.sector",
      },
      {
        path: "views",
        select: "_id username profilePicture",
      },
    ]);

    return res.status(200).json(alert);
  } catch (err) {
    console.error("Get alert by ID error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/alerts/:id/upvote
 * Toggle upvote on an alert (add or remove current user).
 */
const upvoteAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    const userId = req.user.id;
    const index = alert.upvotes.indexOf(userId);

    if (index === -1) {
      alert.upvotes.push(userId);
    } else {
      alert.upvotes.splice(index, 1);
    }

    await alert.save();

    const populated = await alert.populate({
      path: "postedBy",
      select: "username profilePicture location.sector",
    });

    return res.status(200).json(populated);
  } catch (err) {
    console.error("Upvote alert error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/alerts/:id/comments
 * Add a comment to a specific alert.
 */
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    alert.comments.push({
      postedBy: req.user.id,
      text: text.trim(),
    });

    await alert.save();

    // Parse @mentions in comment text and dispatch TAG_MENTION notifications
    try {
      const mentionRegex = /@([\w.\s]+?)(?=\s|$|@|,|\.|!|\?)/g;
      let match;
      const mentionedNames = [];

      while ((match = mentionRegex.exec(text)) !== null) {
        mentionedNames.push(match[1].trim());
      }

      if (mentionedNames.length > 0) {
        const mentionedUsers = await User.find({
          username: { $in: mentionedNames },
          _id: { $ne: req.user.id },
        }).select("_id");

        const newComment = alert.comments[alert.comments.length - 1];

        if (mentionedUsers.length > 0) {
          const mentionNotifs = mentionedUsers.map((u) => ({
            recipient: u._id,
            sender: req.user.id,
            type: "TAG_MENTION",
            sector: alert.targetSector,
            targetPost: alert._id,
            targetComment: newComment._id,
          }));
          await Notification.insertMany(mentionNotifs);
        }
      }

      // Also notify the post author about the new comment (COMMENT_REPLY)
      if (alert.postedBy.toString() !== req.user.id) {
        const newComment = alert.comments[alert.comments.length - 1];
        await Notification.create({
          recipient: alert.postedBy,
          sender: req.user.id,
          type: "COMMENT_REPLY",
          sector: alert.targetSector,
          targetPost: alert._id,
          targetComment: newComment._id,
        });
      }
    } catch (notifErr) {
      console.error("Comment notification dispatch error:", notifErr);
      // Non-blocking
    }

    // Re-populate alert poster and comment posters
    await alert.populate([
      { path: "postedBy", select: "username profilePicture location.sector" },
      {
        path: "comments.postedBy",
        select: "username profilePicture location.sector",
      },
    ]);

    return res.status(201).json(alert);
  } catch (err) {
    console.error("Add comment error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/alerts/sectors/:sectorName/read
 * Mark all posts in a sector as seen by the authenticated user.
 * Appends user ID to each post's seenBy array if not already present.
 */
const markSectorRead = async (req, res) => {
  try {
    const { sectorName } = req.params;
    const userId = req.user.id;

    await Alert.updateMany(
      { targetSector: sectorName, seenBy: { $ne: userId } },
      { $addToSet: { seenBy: userId } }
    );

    return res.status(200).json({ message: `All posts in ${sectorName} marked as read` });
  } catch (err) {
    console.error("Mark sector read error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/alerts/:id/viewers
 * Fetch populated viewer profiles for the post impressions modal.
 */
const getPostViewers = async (req, res) => {
  try {
    const post = await Alert.findById(req.params.id).populate({
      path: 'views',
      select: '_id username profilePicture',
    });

    if (!post) {
      return res.status(404).json({ message: "Post data not discovered" });
    }

    // Format payload to match frontend viewer list expectations
    const formattedViewers = (post.views || []).map((user) => ({
      id: user._id,
      name: user.username,
      avatar: user.profilePicture || "/default-avatar.png",
    }));

    return res.json({ viewers: formattedViewers });
  } catch (err) {
    console.error("Get post viewers error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/alerts/sectors/:sectorName/priority
 * Fetch the single highest-priority or latest post for a sector's banner.
 */
const getSectorPriority = async (req, res) => {
  try {
    const { sectorName } = req.params;

    const priorityPost = await Alert.findOne({ targetSector: sectorName })
      .sort({ urgency: -1, createdAt: -1 })
      .populate('postedBy', 'username profilePicture');

    if (!priorityPost) {
      return res.status(200).json({
        message: "No active announcements found for this sector",
        data: null,
      });
    }

    // Return clean payload matching frontend banner expectations
    return res.status(200).json({
      data: {
        _id: priorityPost._id,
        title: priorityPost.title,
        message: priorityPost.description,
        category: priorityPost.category,
        isUrgent: priorityPost.urgency === "High",
        urgency: priorityPost.urgency,
        targetSector: priorityPost.targetSector,
        createdAt: priorityPost.createdAt,
        author: priorityPost.postedBy
          ? {
              id: priorityPost.postedBy._id,
              name: priorityPost.postedBy.username,
              avatar: priorityPost.postedBy.profilePicture || "/default-avatar.png",
            }
          : null,
      },
    });
  } catch (err) {
    console.error("Get sector priority error:", err);
    return res.status(500).json({ error: "Failed to pull operational banner feed" });
  }
};

module.exports = {
  createAlert,
  getAllAlerts,
  getAlertById,
  getPostViewers,
  getSectorPriority,
  upvoteAlert,
  addComment,
  markSectorRead,
};
