// backend/src/app.js

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware");
const progressRoutes = require("./routes/progressRoutes");
const app = express();

// ======================
// Middleware
// ======================

// JSON body parser
app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: [
      process.env.FRONTEND_ORIGIN,
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);

// ======================
// MongoDB Connection
// ======================

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("❌ Missing MONGODB_URI in environment variables");
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("❌ MongoDB Error:", err);
    process.exit(1);
  });

// ======================
// Routes
// ======================

app.use("/api/v1/auth", authRoutes);

app.use("/api/progress", authMiddleware, progressRoutes);

// ======================
// Health Route
// ======================

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ======================
// Export App
// ======================

module.exports = app;
