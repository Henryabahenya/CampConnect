const router = require("express").Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  updateProfile,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const User = require("../models/User");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put(
  "/profile",
  authMiddleware,
  upload.single("profilePicture"),
  updateProfile,
);

// Profile setup progress tracker (must be before /users/:id to avoid param capture)
router.get("/users/profile-progress", authMiddleware, async (req, res) => {
  try {
    const userProfile = await User.findById(req.user.id);
    if (!userProfile) {
      return res.status(404).json({ message: "User profile record not found" });
    }

    let scoreWeight = 0;
    const totalWeights = 5;

    if (userProfile.username) scoreWeight += 1;
    if (userProfile.location?.sector) scoreWeight += 1;
    if (userProfile.location?.specificLocation?.zone) scoreWeight += 1;
    if (userProfile.location?.specificLocation?.block) scoreWeight += 1;
    if (
      userProfile.profilePicture &&
      !userProfile.profilePicture.includes("ui-avatars.com")
    )
      scoreWeight += 1;

    const progressPercentage = Math.round((scoreWeight / totalWeights) * 100);

    return res.status(200).json({ progressPercentage });
  } catch (error) {
    console.error("Profile progress error:", error);
    return res
      .status(500)
      .json({ error: "Failed to evaluate backend tracker milestones" });
  }
});

// Public profile lookup
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "username profilePicture location.campSystem location.sector location.specificLocation bio",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
