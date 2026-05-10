const express = require("express");
const router = express.Router();
const Progress = require("../models/Progress");
const User = require("../src/models/User");

/* GET leaderboard - TOP 50 by XP */
router.get("/leaderboard", async (req, res) => {
  try {
    // Top 50, descending XP. Populate user name.
    const top = await Progress.find({})
      .sort({ xp: -1 })
      .limit(50)
      .populate("userId", "name avatar");

    const formatted = top.map((p, i) => {
      const u = p.userId || {};
      return {
        rank: i + 1,
        id: u._id || p._id,
        name: u.name || "Anonymous",
        avatar: u.avatar || "/cats/cat1.png",
        xp: p.xp,
        language: p.language
      };
    });
    res.json(formatted);
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

/* GET progress for language */
router.get("/:language", async (req, res) => {
  const userId = req.user.id; // from auth middleware
  const { language } = req.params;

  let progress = await Progress.findOne({ userId, language });

  if (!progress) {
    progress = await Progress.create({
      userId,
      language,
      completedLevels: [],
    });
  }

  res.json(progress);
});

/* MARK LEVEL COMPLETE */
router.post("/complete", async (req, res) => {
  const userId = req.user.id;
  const { language, level, xpGain = 50, pawsGain = 1 } = req.body;

  try {
      // 1. Update Progress (XP, Levels)
      const progress = await Progress.findOneAndUpdate(
        { userId, language },
        {
          $addToSet: { completedLevels: level },
          $inc: { xp: xpGain, paws: pawsGain },
        },
        { new: true, upsert: true }
      );

      // 2. Update User Stats (Streak, Activity Graph)
      const user = await User.findById(userId);
      if (user) {
          const now = new Date();
          const todayStr = now.toISOString().split('T')[0];
          
          // Streak Logic
          const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
          let newStreak = user.streak || 0;

          if (lastActive) {
              const lastDateStr = lastActive.toISOString().split('T')[0];
              const diffTime = Math.abs(now - lastActive);
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
              
              // Check exact calendar days difference
              const yesterday = new Date(now);
              yesterday.setDate(yesterday.getDate() - 1);
              const yesterdayStr = yesterday.toISOString().split('T')[0];

              if (lastDateStr === todayStr) {
                  // Already active today, streak doesn't change
              } else if (lastDateStr === yesterdayStr) {
                  // Continued streak
                  newStreak += 1;
              } else {
                  // Broken streak
                  newStreak = 1;
              }
          } else {
              // First time ever
              newStreak = 1;
          }

          // Activity Log Logic
          let activityLog = user.activityLog || [];
          const todayEntryIndex = activityLog.findIndex(e => e.date === todayStr);
          
          if (todayEntryIndex >= 0) {
              const entry = activityLog[todayEntryIndex];
              entry.count += 1;
              // Recalculate level intensity
              if (entry.count > 5) entry.level = 3;
              else if (entry.count > 2) entry.level = 2;
              else entry.level = 1;
              activityLog[todayEntryIndex] = entry;
          } else {
              activityLog.push({ date: todayStr, count: 1, level: 1 });
          }

          // Keep log size manageable (e.g. last 365 days)
          if (activityLog.length > 365) {
              activityLog = activityLog.slice(-365);
          }

          user.streak = newStreak;
          user.lastActiveDate = now;
          user.activityLog = activityLog;
          
          // Update Level if needed (e.g. based on total XP or completed levels)
          // For now, just track max level reported by frontend or progress
          if (progress.completedLevels.length >= user.level) {
              user.level = progress.completedLevels.length + 1;
          }

          await user.save();
      }

      res.json({ progress, user });
  } catch (e) {
      console.error("Complete Level Error", e);
      res.status(500).json({ error: "Failed to update progress" });
  }
});

module.exports = router;
