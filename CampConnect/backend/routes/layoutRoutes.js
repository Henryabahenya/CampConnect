const router = require("express").Router();

/**
 * GET /api/layout/landing-config
 * Returns the landing page configuration metadata.
 */
router.get("/landing-config", (req, res) => {
  return res.status(200).json({
    theme: {
      backgroundGradient: "from-white via-slate-50 to-blue-50/50",
      primaryBrandColor: "blue-600",
      textHeadingColor: "slate-900",
    },
    navigationLinks: [
      { name: "Home", targetPath: "/" },
      { name: "About", targetPath: "/about" },
      { name: "Contact", targetPath: "/contact" },
    ],
    brandingPillars: ["Connect", "Engage", "Support", "Protect"],
    // Exposed analytic/stat values — can be backed by DB in future
    residentsConnected: "15k+",
  });
});

module.exports = router;
