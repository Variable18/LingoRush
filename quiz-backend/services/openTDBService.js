const axios = require('axios');

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function difficultyToRating(diff) {
  if (diff === 'easy') return 900;
  if (diff === 'medium') return 1200;
  return 1500;
}

/**
 * Convert trivia question into language-learning style
 */
function convertToLanguageQuestion(q, language = 'German') {
  // Example: Numbers in language
  const numberMap = {
    German: {
      "1": "eins",
      "2": "zwei",
      "3": "drei",
      "4": "vier"
    },
    Spanish: {
      "1": "uno",
      "2": "dos",
      "3": "tres",
      "4": "cuatro"
    }
  };

  const isNumber = numberMap[language][q.correct_answer];

  if (isNumber) {
    return {
      text: `How do you say "${q.correct_answer}" in ${language}?`,
      choices: shuffle([
        numberMap[language][q.correct_answer],
        ...q.incorrect_answers.map(a => numberMap[language][a]).filter(Boolean)
      ]),
      answer: numberMap[language][q.correct_answer],
      uiType: 'mcq',
      difficultyRating: difficultyToRating(q.difficulty),
      meta: { source: 'opentdb', type: 'numbers' }
    };
  }

  // Default: vocabulary-style question
  return {
    text: `Select the correct word (${language}): ${q.correct_answer}`,
    choices: shuffle([q.correct_answer, ...q.incorrect_answers]),
    answer: q.correct_answer,
    uiType: 'mcq',
    difficultyRating: difficultyToRating(q.difficulty),
    meta: { source: 'opentdb', type: 'vocab' }
  };
}

async function fetchLanguageQuestions(amount = 5, language = 'German') {
  const url = `https://opentdb.com/api.php?amount=${amount}&type=multiple`;
  const res = await axios.get(url);

  return res.data.results.map(q => convertToLanguageQuestion(q, language));
}

module.exports = { fetchLanguageQuestions };
