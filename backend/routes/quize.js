const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz"); // MongoDB schema

router.post("/", async (req, res) => {
  try {
    const newQuiz = new Quiz(req.body);
    await newQuiz.save();
    res.status(201).json({ message: "Quiz created" });
  } catch (err) {
    console.error("Failed to create quiz:", err);
    res.status(500).json({ error: "Server error creating quiz" });
  }
});
// PUT update quiz by ID
router.put("/:id", async (req, res) => {
  try {
    await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Quiz updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update quiz" });
  }
});

// DELETE quiz by ID
router.delete("/:id", async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: "Quiz deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete quiz" });
  }
});
module.exports = router;

// GET all quizzes
// GET /api/quizzes?currentRole=Frontend&desiredRole=Fullstack
router.get("/", async (req, res) => {
  try {
    const { currentRole, desiredRole } = req.query;
    const filters = {};

    if (currentRole) filters.role = currentRole;
    if (desiredRole) filters.skill = desiredRole;

    const quizzes = await Quiz.find(filters);
    res.json(quizzes);
  } catch (err) {
    console.error("Failed to fetch quizzes:", err);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});


