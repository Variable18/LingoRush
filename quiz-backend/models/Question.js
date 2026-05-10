const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  language: { type: String, default: 'English' },
  level: { type: Number, default: 1 },
  uiType: { type: String, enum: ['flipcard','mcq','dragdrop','sort','fill'], default: 'mcq' },
  text: { type: String, required: true },
  choices: { type: [String], default: [] },      // for mcq/drag
  answer: { type: mongoose.Schema.Types.Mixed, required: true }, // string or array
  hints: { type: [String], default: [] },
  difficultyRating: { type: Number, default: 1200 }, // Elo-like numeric difficulty
  meta: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', QuestionSchema);
