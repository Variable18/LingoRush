const express = require("express");
const router = express.Router();

const predictDifficulty = require("../ml/runPrediction");

router.get("/next-task", async (req, res) => {
  const { language = "german", history = "" } = req.query;

  try {
    // 🔥 REAL ML PREDICTION
    const difficulty = await predictDifficulty(history);

    let gameType = "word_match";
    if (difficulty === "medium") gameType = "mcq";
    if (difficulty === "hard") gameType = "sentence_builder";

    res.json({
      language,
      difficulty,
      gameType,
      content: [
        { de: "Haus", en: "House" },
        { de: "Wasser", en: "Water" }
      ],
      mlUsed: true
    });
  } catch (err) {
    res.status(500).json({ error: "ML prediction failed", details: err });
  }
});

module.exports = router;
