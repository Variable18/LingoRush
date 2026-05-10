const express = require('express');
const router = express.Router();
const { fetchLanguageQuestions } = require('../services/openTDBService');

router.get('/', async (req, res) => {
  try {
    const { language = 'German', count = 5 } = req.query;
    const questions = await fetchLanguageQuestions(parseInt(count), language);
    res.json({ language, questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch external questions' });
  }
});

module.exports = router;
