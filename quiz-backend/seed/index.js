require("dotenv").config();
const mongoose = require("mongoose");

const DragDropSentence = require("../models/DragDropSentence");
const SentenceBuilder = require("../models/SentenceBuilder");

const dragDropData = require("./german/dragdrop.german.seed");
const sentenceBuilderData = require("./german/sentencebuilder.german.seed");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");

    await DragDropSentence.deleteMany({ language: "german" });
    await SentenceBuilder.deleteMany({ language: "german" });

    await DragDropSentence.insertMany(dragDropData);
    await SentenceBuilder.insertMany(sentenceBuilderData);

    console.log("✅ German learning data seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed", err);
    process.exit(1);
  }
}

seed();
