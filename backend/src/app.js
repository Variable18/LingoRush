// backend/src/app.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth"); // ensure this exists

const app = express();

// JSON body parser
app.use(express.json());

// CORS: allow both Vite (5173, 5174) and other dev origins (3000)
const allowedOrigins = [
  process.env.FRONTEND_ORIGIN || "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin) return next(); // server-to-server or curl
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") return res.sendStatus(204);
    return next();
  } else {
    return res.status(403).send("CORS: Origin not allowed");
  }
});

// MongoDB connection (use process.env only)
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error("❌ Missing MONGODB_URI in backend/.env");
  process.exit(1);
}

// Optional: safe host for logging (don't print credentials)
const safeHost = mongoUri.replace(/^(mongodb(?:\+srv)?:\/\/)(.*@)?/, "");
console.log("Loaded MONGODB_URI =>", mongoUri);
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB Atlas (" + safeHost + ")"))
  .catch((err) => {
    console.error("❌ MongoDB Error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/v1/auth", authRoutes);

// Health
app.get("/health", (req, res) => res.json({ status: "ok" }));

module.exports = app;

const authMiddleware = require("../middleware/authMiddleware");
const progressRoutes = require("../routes/progressRoutes");

app.use("/api/progress", authMiddleware, progressRoutes);

