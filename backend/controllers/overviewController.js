const User = require("../models/User");
const Quiz = require("../models/Quiz");
const Module = require("../models/Module");
const Activity = require("../models/Activity");

exports.getOverviewStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    const quizzes = await Quiz.find({ userId });
    const modules = await Module.find({ userId });
    const skillGaps = []; // You can later populate this from another logic or model

    const completedQuizzes = quizzes.filter((q) => q.completed).length;
    const completedModules = modules.filter((m) => m.completed).length;

    res.json({
      xp: user?.xp || 0,
      level: user?.level || 1,
      skillGaps: skillGaps.length,
      completedQuizzes,
      completedModules,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const { userId } = req.params;
    const activities = await Activity.find({ userId })
      .sort({ time: -1 })
      .limit(10);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
