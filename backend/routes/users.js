const express = require("express");
const router = express.Router();
const User = require("../models/User");

// PUT /api/users/:id — Update user profile
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      skills,
      currentRole,
      desiredRole,
      xp,
      level,
      badges,
      profileComplete,
    } = req.body;

    const updateFields = {
      ...(name && { name }),
      ...(skills && { skills }),
      ...(currentRole && { currentRole }),
      ...(desiredRole && { desiredRole }),
      ...(xp !== undefined && { xp }),
      ...(level !== undefined && { level }),
      ...(badges && { badges }),
      ...(profileComplete !== undefined && { profileComplete }),
    };

    const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.json(updatedUser);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
});

module.exports = router;
