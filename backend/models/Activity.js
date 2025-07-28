const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: String, // quiz, module, badge, interview
  title: String,
  time: Date,
  details: Object,
});

module.exports = mongoose.model("Activity", activitySchema);
