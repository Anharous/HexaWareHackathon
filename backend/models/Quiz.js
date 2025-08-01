const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [String],
  correct: { type: Number, required: true },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "easy",
  },
  skill: String,
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  role: { type: String, required: true },
  skill: { type: String, required: true },
  questions: [questionSchema],
  completed: { type: Boolean, default: false },
  score: Number,
  timeLimit: { type: Number, required: true },
});

module.exports = mongoose.model("Quiz", quizSchema);
