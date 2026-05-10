const express = require('express');
const router = express.Router();
const User = require('../models/User');
const languageLevels = require('../data/languageLevels');

/**
 * POST /api/level-submit
 * body:
 * {
 *   userId,
 *   language,
 *   level,
 *   answers: [
 *     { word, correct }
 *   ]
 * }
 */
router.post('/', async (req, res) => {
  const { userId, language, level, answers } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  // update word stats
  answers.forEach(({ word, correct }) => {
    let stat = user.wordStats.find(w => w.word === word);
    if (!stat) {
      stat = { word, correct: 0, total: 0 };
      user.wordStats.push(stat);
    }
    stat.total += 1;
    if (correct) stat.correct += 1;
  });

  // mastery check
  const focusWords = languageLevels[language][level].focusWords;

  const masteredWords = focusWords.filter(word => {
    const stat = user.wordStats.find(w => w.word === word);
    if (!stat) return false;
    return stat.total >= 3 && (stat.correct / stat.total) >= 0.8;
  });

  let levelPassed = masteredWords.length === focusWords.length;

  if (levelPassed) {
    user.currentLevel += 1;
  }

  await user.save();

  res.json({
    levelPassed,
    masteredWords,
    nextLevel: user.currentLevel
  });
});

module.exports = router;
