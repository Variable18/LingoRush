const mongoose = require("mongoose");

const SentenceBuilderSchema = new mongoose.Schema(
  {
    language: {
      type: String,
      required: true,
      index: true
    },
    level: {
      type: Number,
      required: true,
      index: true
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true
    },
    enSentence: {
      type: String,
      required: true
    },
    deWords: {
      type: [String],
      required: true,
      validate: v => v.length > 0
    }
  },
  { timestamps: true }
);

SentenceBuilderSchema.index(
  { language: 1, level: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "SentenceBuilder",
  SentenceBuilderSchema
);
