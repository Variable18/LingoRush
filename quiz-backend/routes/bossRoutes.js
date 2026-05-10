const express = require("express");
const router = express.Router();

const Question = require("../models/Question");

// GET boss level data (with fallback)
router.get("/german/boss/:level", async (req, res) => {
  const level = Number(req.params.level);

  try {
    // Fallback: reuse normal German questions
    const wordPairs = await Question.find({
      language: "german"
    })
      .limit(5)
      .lean();

    if (!wordPairs || wordPairs.length === 0) {
      return res.status(404).json({
        message: "No German questions available for boss level"
      });
    }

    // Reuse same data for multiple games
    res.json({
      wordPairs,          // Word Match
      listeningPairs: wordPairs, // Listening
      mcqPairs: wordPairs,       // MCQ

      // These are handled by level-based routes
      dragDropLevel: level,
      sentenceLevel: level
    });
  } catch (err) {
    console.error("Boss fetch error:", err);
    res.status(500).json({
      message: "Failed to load boss data"
    });
  }
});

module.exports = router;
