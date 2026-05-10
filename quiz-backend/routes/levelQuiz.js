const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: '✅ LEVEL QUIZ ROUTE CONFIRMED',
    language: req.query.language,
    level: req.query.level,
    focusWords: ['ich', 'bin', 'ein', 'Student'],
    questions: [
      {
        type: 'mcq',
        prompt: 'Select the correct word',
        options: ['ich', 'bin', 'ein', 'Student'],
        answer: 'ich'
      },
      {
        type: 'dragdrop',
        prompt: 'Form a correct sentence',
        words: ['bin', 'ich', 'ein', 'Student'],
        answer: ['ich', 'bin', 'ein', 'Student']
      }
    ]
  });
});

module.exports = router;
