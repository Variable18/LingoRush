// server.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= DATABASE ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected (quiz-backend)"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

/* ================= ROUTES ================= */

// Existing quiz routes
const levelQuizRoutes = require("./routes/levelQuiz");
const levelSubmitRoutes = require("./routes/levelSubmit");

// ML routes
const mlRoutes = require("./routes/mlRoutes");

// Learning routes (NEW – production)
const learnRoutes = require("./routes/learnRoutes");
const dragDropRoutes = require("./routes/dragDropRoutes");
const sentenceRoutes = require("./routes/sentenceRoutes");
const bossRoutes = require("./routes/bossRoutes");

/* ================= REGISTER ROUTES ================= */

app.use("/api/level-quiz", levelQuizRoutes);
app.use("/api/level-submit", levelSubmitRoutes);
app.use("/ml", mlRoutes);

// 🔑 Learning system
app.use("/api/learn", learnRoutes);
app.use("/api/learn", dragDropRoutes);
app.use("/api/learn", sentenceRoutes);
app.use("/api/learn", bossRoutes);

/* ================= 404 HANDLER ================= */
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/* ================= SERVER ================= */
const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Quiz / ML backend running on port ${PORT}`);
});
