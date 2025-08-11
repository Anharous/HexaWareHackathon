// backend/jobs/dailyNotificationJob.js
require("dotenv").config();
const cron = require("node-cron");
const connectDB = require("../config/db");
const User = require("../models/User");
const { getDailyMessage } = require("../services/aiMessageGenerator");
const { sendEmail } = require("../services/emailService");

let task = null;

// Helper: send email to a single user
async function notifyUser(user) {
  try {
    const { subject, html } = await getDailyMessage(user);
    await sendEmail(user.email, subject, html);

    // update the user's lastNotifiedAt
    user.lastNotifiedAt = new Date();
    await user.save();
    console.log(`Notified ${user.email}`);
  } catch (err) {
    console.error(`Failed to notify ${user.email}:`, err.message || err);
  }
}

/**
 * runOnce: connects to DB and sends email to each active user
 * Filters: you can change filter (e.g., only if profileComplete)
 */
async function runOnce() {
  await connectDB();

  // Example filter: only users with an email
  const users = await User.find({ email: { $exists: true, $ne: null } });

  for (const user of users) {
    // Avoid emailing multiple times per day: check lastNotifiedAt
    if (user.lastNotifiedAt) {
      const last = new Date(user.lastNotifiedAt);
      const now = new Date();
      if (now.toDateString() === last.toDateString()) {
        console.log(`Skipping ${user.email} (already notified today)`);
        continue;
      }
    }

    await notifyUser(user);
  }
}

/**
 * start - schedule the cron job
 * Default schedule: daily at 08:00 IST
 */
function start() {
  // If already started, skip
  if (task) {
    console.warn("Daily notification job already started");
    return;
  }

  // Cron expression for 8:00 (server time). If your server uses UTC and you want IST, run at 02:30 UTC (08:00 IST = 02:30 UTC)
  // You can set env CRON_SCHEDULE to override.
  const schedule = process.env.CRON_SCHEDULE || "0 8 * * *"; // server-local 08:00
  task = cron.schedule(
    schedule,
    async () => {
      console.log("Starting daily notification job...");
      try {
        await runOnce();
      } catch (err) {
        console.error("Daily job error:", err);
      }
    },
    {
      scheduled: true,
    }
  );

  console.log(`Daily notification job scheduled (${schedule}).`);
}

/**
 * stop - stop the cron job
 */
function stop() {
  if (task) {
    task.stop();
    task = null;
  }
}

module.exports = { start, stop, runOnce };
