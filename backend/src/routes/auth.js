const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../../middleware/authMiddleware");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;


// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ error: "Email already registered" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash: hash,
    });

    return res.status(201).json({ success: true, message: "User created" });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ success: true, token, user });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Update Profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, avatar, email, phone } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (avatar !== undefined) updates.avatar = avatar;
    if (email !== undefined) updates.email = email;
    if (phone !== undefined) updates.phone = phone;

    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json({ success: true, user });
  } catch (err) {
    console.error("Profile update error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Get Current User (Sync)
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ success: true, user });
  } catch (err) {
    console.error("Fetch user error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
