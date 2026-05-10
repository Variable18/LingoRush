const express = require("express");
const router = express.Router();
const words = require("../data/germanWords");

router.get("/german/level/:level", (req, res) => {
  const level = parseInt(req.params.level);

  let pairCount =
    level <= 3 ? 3 :
    level <= 7 ? 4 :
    level <= 12 ? 5 :
    level <= 20 ? 6 : 8;

  const shuffled = [...words].sort(() => Math.random() - 0.5);

  res.json({
    level,
    gameType: "match",
    pairs: shuffled.slice(0, pairCount),
  });
});

module.exports = router;
