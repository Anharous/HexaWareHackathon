const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  completed: { type: Boolean, default: false },
  completedAt: Date,
});

module.exports = mongoose.model("Module", moduleSchema);
