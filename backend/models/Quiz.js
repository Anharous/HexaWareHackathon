const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  score: Number,
  completed: { type: Boolean, default: false },
  completedAt: Date,
});

module.exports = mongoose.model("Quiz", quizSchema);