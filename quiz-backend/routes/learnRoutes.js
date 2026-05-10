const express = require("express");
const router = express.Router();

/* ================= WORD POOL (TIERED) ================= */

const germanWords = [
  // TIER 1 – VERY EASY (Level 1–3)
  { de: "Wasser", en: "Water", tier: 1 },
  { de: "Haus", en: "House", tier: 1 },
  { de: "Brot", en: "Bread", tier: 1 },
  { de: "Buch", en: "Book", tier: 1 },
  { de: "Apfel", en: "Apple", tier: 1 },

  // TIER 2 – EASY (Level 4–6)
  { de: "Hund", en: "Dog", tier: 2 },
  { de: "Katze", en: "Cat", tier: 2 },
  { de: "Stuhl", en: "Chair", tier: 2 },
  { de: "Tisch", en: "Table", tier: 2 },
  { de: "Milch", en: "Milk", tier: 2 },

  // TIER 3 – MEDIUM (Level 7–10)
  { de: "Schule", en: "School", tier: 3 },
  { de: "Freund", en: "Friend", tier: 3 },
  { de: "Stadt", en: "City", tier: 3 },
  { de: "Land", en: "Country", tier: 3 },

  // TIER 4 – HARD (Level 11+)
  { de: "Geschwindigkeit", en: "Speed", tier: 4 },
  { de: "Möglichkeit", en: "Possibility", tier: 4 },
];

/* ================= LEVEL API ================= */

router.get("/german/level/:level", (req, res) => {
  const level = parseInt(req.params.level, 10);

  let maxTier;
  let pairCount;
  let difficulty;

  /* -------- LEVEL → DIFFICULTY MAPPING -------- */
  if (level === 1) {
    maxTier = 1;
    pairCount = 3;
    difficulty = "Easy";
  } else if (level <= 3) {
    maxTier = 1;
    pairCount = 4;
    difficulty = "Easy";
  } else if (level <= 6) {
    maxTier = 2;
    pairCount = 5;
    difficulty = "Medium";
  } else if (level <= 10) {
    maxTier = 3;
    pairCount = 6;
    difficulty = "Medium";
  } else {
    maxTier = 4;
    pairCount = 8;
    difficulty = "Hard";
  }

  /* -------- FILTER WORDS BY TIER -------- */
  const eligibleWords = germanWords.filter(
    word => word.tier <= maxTier
  );

  /* -------- SAFETY CHECK -------- */
  if (eligibleWords.length < pairCount) {
    return res.status(500).json({
      error: "Not enough words for this level",
    });
  }

  /* -------- SHUFFLE & PICK -------- */
  const shuffled = [...eligibleWords].sort(() => Math.random() - 0.5);
  const selectedPairs = shuffled.slice(0, pairCount);

  /* -------- RESPONSE -------- */
  res.json({
    level,
    difficulty,
    gameType: "match",
    pairs: selectedPairs,
  });
});

module.exports = router;
