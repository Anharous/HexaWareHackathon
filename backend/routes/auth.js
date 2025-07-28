const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const newUser = new User({
      email,
      name,
      password, // for now, plain text; ideally, hash in future
      role: "employee",
      profileComplete: false,
      skills: [],
      currentRole: "",
      desiredRole: "",
      xp: 0,
      level: 1,
      badges: [],
    });

    await newUser.save();
    console.log("✅ New user saved:", newUser); // <== Add this
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
