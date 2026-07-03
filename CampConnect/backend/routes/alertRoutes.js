const router = require("express").Router();
const {
  createAlert,
  getAllAlerts,
  getAlertById,
  getPostViewers,
  getSectorPriority,
  upvoteAlert,
  addComment,
  markSectorRead,
} = require("../controllers/alertController");
const authMiddleware = require("../middleware/authMiddleware");
const { optionalAuth } = require("../middleware/authMiddleware");

router.get("/", optionalAuth, getAllAlerts);
router.get("/:id", authMiddleware, getAlertById);
router.get("/:id/viewers", authMiddleware, getPostViewers);
router.post("/", authMiddleware, createAlert);
router.post("/:id/upvote", authMiddleware, upvoteAlert);
router.post("/:id/comments", authMiddleware, addComment);
router.get("/sectors/:sectorName/priority", optionalAuth, getSectorPriority);
router.post("/sectors/:sectorName/read", authMiddleware, markSectorRead);

module.exports = router;
