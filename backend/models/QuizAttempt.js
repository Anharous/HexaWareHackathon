const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  answers: [Number], // Array of selected option indexes per question
  score: { type: Number, required: true },
  attemptedAt: { type: Date, default: Date.now },
  timeTaken: { type: Number, required: true },
});

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);
