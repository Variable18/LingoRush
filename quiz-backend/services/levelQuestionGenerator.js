/**
 * Generates Duolingo-style questions from a level definition.
 * Games included:
 * 1. Word recognition (MCQ)
 * 2. Sentence formation (Drag & Drop)
 */

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function generateLevelQuestions(levelData) {
  const questions = [];

  // 1️⃣ MCQ: Recognize correct word
  levelData.focusWords.forEach(word => {
    questions.push({
      type: 'mcq',
      prompt: `Select the correct word`,
      options: shuffle([...levelData.focusWords]),
      answer: word
    });
  });

  // 2️⃣ Drag & Drop: Build sentence
  levelData.sentences.forEach(sentence => {
    const parts = sentence.split(' ');
    questions.push({
      type: 'dragdrop',
      prompt: 'Form a correct sentence',
      words: shuffle([...parts]),
      answer: parts
    });
  });

  // Ensure enough repetition (5–10 questions total)
  return shuffle([...questions, ...questions]).slice(0, 8);
}

module.exports = {
  generateLevelQuestions
};
