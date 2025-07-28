const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
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
});

module.exports = mongoose.model("User", userSchema);
