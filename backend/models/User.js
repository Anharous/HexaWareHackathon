// backend/models/User.js
const mongoose = require("mongoose");

const roadmapItemSchema = new mongoose.Schema({
  title: String, // e.g. "React Hooks"
  description: String, // small description or objectives
  priority: { type: Number, default: 1 },
  recommendedDate: Date, // optional: when to study
  completed: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  password: String,
  role: { type: String, enum: ["employee", "admin"], default: "employee" },
  profileComplete: { type: Boolean, default: false },
  skills: [String],
  currentRole: String,
  desiredRole: String,
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  badges: [String],

  // new fields to support the daily email workflow
  roadmap: [roadmapItemSchema], // personalized roadmap (can be empty)
  lastNotifiedAt: Date, // to track last email sent
});

module.exports = mongoose.model("User", userSchema);
