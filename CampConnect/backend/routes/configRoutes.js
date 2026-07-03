const router = require("express").Router();

/**
 * GET /api/config/hotlines
 * Returns the emergency contact directory for the footer component.
 */
router.get("/hotlines", (req, res) => {
  return res.status(200).json({
    footerTheme: { backgroundColor: "slate-100", borderStyle: "slate-200" },
    adminEmail: "abahenyahadre@gmail.com",
    contacts: [
      {
        id: "unhcr",
        category: "UNHCR Helpline",
        baseline: "+254768407749",
        type: "emergency",
      },
      {
        id: "security",
        category: "Camp Security",
        baseline: "+254700000111",
        type: "emergency",
      },
      {
        id: "medical",
        category: "Medical Emergency",
        baseline: "+254700000222",
        type: "critical",
      },
      {
        id: "water",
        category: "Water & Sanitation",
        baseline: "+254700000333",
        type: "utility",
      },
    ],
  });
});

module.exports = router;
