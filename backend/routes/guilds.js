const express = require("express");
const router = express.Router();
const Guild = require("../models/Guild");

// GET /api/guilds - Get all active guilds
router.get("/", async (req, res) => {
  try {
    const guilds = await Guild.find({ isActive: true })
      .populate('members', 'name email')
      .populate('moderators', 'name email')
      .sort({ lastActivity: -1 });
    
    res.json(guilds);
  } catch (err) {
    console.error("Get guilds error:", err);
    res.status(500).json({ error: "Failed to fetch guilds" });
  }
});

// GET /api/guilds/:id - Get specific guild with messages
router.get("/:id", async (req, res) => {
  try {
    const guild = await Guild.findById(req.params.id)
      .populate('members', 'name email level xp')
      .populate('moderators', 'name email');
    
    if (!guild) return res.status(404).json({ error: "Guild not found" });
    
    res.json(guild);
  } catch (err) {
    console.error("Get guild error:", err);
    res.status(500).json({ error: "Failed to fetch guild" });
  }
});

// POST /api/guilds/:id/join - Join a guild
router.post("/:id/join", async (req, res) => {
  try {
    const { userId } = req.body;
    const guild = await Guild.findById(req.params.id);
    
    if (!guild) return res.status(404).json({ error: "Guild not found" });
    
    if (!guild.members.includes(userId)) {
      guild.members.push(userId);
      await guild.save();
    }
    
    res.json({ message: "Successfully joined guild" });
  } catch (err) {
    console.error("Join guild error:", err);
    res.status(500).json({ error: "Failed to join guild" });
  }
});

// POST /api/guilds/:id/messages - Send message to guild
router.post("/:id/messages", async (req, res) => {
  try {
    const { senderId, senderName, content, messageType = 'text' } = req.body;
    const guild = await Guild.findById(req.params.id);
    
    if (!guild) return res.status(404).json({ error: "Guild not found" });
    
    const newMessage = {
      senderId,
      senderName,
      content,
      messageType,
      timestamp: new Date()
    };
    
    guild.messages.push(newMessage);
    guild.lastActivity = new Date();
    await guild.save();
    
    const io = req.app.get("io");
    if (io) {
      io.to(req.params.id).emit("receiveMessage", newMessage);
    }
    
    res.json(newMessage);
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// GET /api/guilds/:id/messages - Get guild messages with pagination
router.get("/:id/messages", async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const guild = await Guild.findById(req.params.id);
    
    if (!guild) return res.status(404).json({ error: "Guild not found" });
    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const messages = guild.messages
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(startIndex, endIndex)
      .reverse();
    
    res.json(messages);
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = router;