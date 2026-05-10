const mongoose = require('mongoose');

const WordStatSchema = new mongoose.Schema({
  word: String,
  correct: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,

  currentLanguage: { type: String, default: 'German' },
  currentLevel: { type: Number, default: 1 },

  wordStats: [WordStatSchema],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
