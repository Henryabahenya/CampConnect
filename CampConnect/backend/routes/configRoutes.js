const router = require("express").Router();

/**
 * GET /api/config/hotlines
 * Returns emergency contact configuration.
 * Initially empty - should be populated by admin through database.
 */
router.get("/hotlines", (req, res) => {
  return res.status(200).json({
    footerTheme: { backgroundColor: "slate-100", borderStyle: "slate-200" },
    adminEmail: process.env.ADMIN_EMAIL || "admin@campconnect.local",
    contacts: [
      // Contacts should be managed through database, not hard-coded
      // Example template:
      // {
      //   id: "unhcr",
      //   category: "UNHCR Helpline",
      //   baseline: "+254768407749",
      //   type: "emergency",
      // }
    ],
  });
});

module.exports = router;
