const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  premium: { type: Boolean, default: false },
  avatar: { type: String, default: "/cats/cat1.png" }, // Default avatar
  phone: { type: String, default: "" },
  
  // Stats
  streak: { type: Number, default: 0 },
  lastActiveDate: { type: Date },
  level: { type: Number, default: 1 }, // Global level or calculate from Progress
  
  // GitHub-style activity log
  // stored as sparse array of { date: "YYYY-MM-DD", count: N, level: 1-3 }
  activityLog: [{
      date: String, 
      count: Number,
      level: Number
  }],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
