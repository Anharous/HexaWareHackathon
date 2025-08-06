const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  senderName: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  messageType: {
    type: String,
    enum: ["text", "image", "file"],
    default: "text",
  },
});

const guildSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: [
      "frontend",
      "backend",
      "fullstack",
      "mobile",
      "ai-ml",
      "devops",
      "design",
      "general",
    ],
    required: true,
  },
  icon: { type: String, default: "💬" },
  color: { type: String, default: "#3B82F6" },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [messageSchema],
  isActive: { type: Boolean, default: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Guild", guildSchema);
