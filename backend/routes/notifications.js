// backend/routes/notifications.js
const express = require("express");
const router = express.Router();
const { runOnce } = require("../jobs/dailyNotificationJob");

// simple endpoint to manually trigger the job (protected in prod)
router.post("/trigger", async (req, res) => {
  try {
    await runOnce();
    res.json({ ok: true, message: "Triggered daily notification run" });
  } catch (err) {
    console.error("Manual trigger failed:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
