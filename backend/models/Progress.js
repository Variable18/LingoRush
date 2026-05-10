const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    language: {
      type: String,
      required: true, // "german"
    },
    completedLevels: {
      type: [Number],
      default: [],
    },
    xp: {
      type: Number,
      default: 0,
    },
    paws: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Progress", progressSchema);
