const express = require("express");
const router = express.Router();

const DragDropSentence = require("../models/DragDropSentence");

router.get("/german/dragdrop/:level", async (req, res) => {
  let level = Number(req.params.level);

  try {
    let sentence = null;

    // Fallback search: current level → downwards
    while (level > 0 && !sentence) {
      sentence = await DragDropSentence.findOne({
        language: "german",
        level
      }).lean();

      level--;
    }

    if (!sentence) {
      return res.status(404).json({
        message: "No DragDrop data available"
      });
    }

    res.json(sentence);
  } catch (err) {
    console.error("DragDrop fetch error:", err);
    res.status(500).json({
      message: "Failed to fetch DragDrop data"
    });
  }
});

module.exports = router;
