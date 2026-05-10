const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const User = require('../models/User');
const { updateRatings } = require('../utils/elo');

/**
 * GET /api/quiz?userId=...&count=6
 * returns adaptive set of questions for user
 */
router.get('/', async (req, res) => {
  try {
    const { userId, count = 6 } = req.query;
    const user = await User.findById(userId);
    const su = user ? user.skill : 1200;

    const cnt = parseInt(count, 10);
    const nAround = Math.max(1, Math.round(cnt * 0.6));
    const nEasy = Math.max(0, Math.round(cnt * 0.2));
    const nHard = Math.max(0, cnt - nAround - nEasy);

    const sampleByRange = async (min, max, n) => {
      if (n <= 0) return [];
      return await Question.aggregate([
        { $match: { difficultyRating: { $gte: min, $lte: max } } },
        { $sample: { size: n } }
      ]);
    };

    const around = await sampleByRange(su - 75, su + 75, nAround);
    const easy = await sampleByRange(su - 350, su - 100, nEasy);
    const hard = await sampleByRange(su + 100, su + 350, nHard);

    const selected = [...around, ...easy, ...hard].slice(0, cnt);

    const payload = selected.map(q => ({
      _id: q._id,
      text: q.text,
      choices: q.choices,
      uiType: q.uiType || 'mcq',
      difficultyRating: q.difficultyRating
    }));

    res.json({ userSkill: su, questions: payload });
  } catch (err) {
    console.error('GET /api/quiz error', err);
    res.status(500).json({ error: 'server error' });
  }
});

/**
 * POST /api/quiz/submit
 * body: { userId, answers: [{ qid, correct (bool), timeSec }] }
 * updates user.skill and question.difficultyRating
 */
router.post('/submit', async (req, res) => {
  try {
    const { userId, answers } = req.body;
    if (!userId || !Array.isArray(answers)) return res.status(400).json({ error: 'missing params' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'user not found' });

    let su = user.skill || 1200;
    const updates = [];

    for (const a of answers) {
      const q = await Question.findById(a.qid);
      if (!q) continue;
      const sq = q.difficultyRating || 1200;
      const result = a.correct ? 1 : 0;
      const { s_user_new, s_question_new, expected } = updateRatings(su, sq, result);

      // sequentially update user skill so within-quiz answers adapt
      su = s_user_new;

      // persist question difficulty
      q.difficultyRating = s_question_new;
      await q.save();

      // add to history
      user.history.push({ qid: q._id, correct: !!a.correct, timeSec: a.timeSec || null, timestamp: new Date() });

      updates.push({ qid: q._id.toString(), old_q: sq, new_q: s_question_new, expected });
    }

    // save updated skill & maybe update currentLevel (skill->level mapping later)
    user.skill = su;
    await user.save();

    const total = answers.length;
    const correctCount = answers.filter(x => x.correct).length;
    const pct = Math.round((correctCount / (total || 1)) * 100);
    const passed = pct >= 80; // simple immediate pass rule

    res.json({ total, correct: correctCount, pct, passed, newSkill: user.skill, updates });
  } catch (err) {
    console.error('POST /api/quiz/submit error', err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
