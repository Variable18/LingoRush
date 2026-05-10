const express = require("express");
const router = express.Router();

const SentenceBuilder = require("../models/SentenceBuilder");

router.get("/german/sentence/:level", async (req, res) => {
  let level = Number(req.params.level);

  try {
    let sentence = null;

    // Fallback search: current level → downwards
    while (level > 0 && !sentence) {
      sentence = await SentenceBuilder.findOne({
        language: "german",
        level
      }).lean();

      level--;
    }

    if (!sentence) {
      return res.status(404).json({
        message: "No Sentence Builder data available"
      });
    }

    res.json(sentence);
  } catch (err) {
    console.error("SentenceBuilder fetch error:", err);
    res.status(500).json({
      message: "Failed to fetch sentence data"
    });
  }
});

module.exports = router;
