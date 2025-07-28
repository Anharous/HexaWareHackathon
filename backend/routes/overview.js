const express = require("express");
const router = express.Router();
const {
  getOverviewStats,
  getRecentActivity,
} = require("../controllers/overviewController");

router.get("/:userId/stats", getOverviewStats);
router.get("/:userId/activities", getRecentActivity);

module.exports = router;
