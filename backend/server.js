// server.js
require("dotenv").config(); // MUST be first
console.log("Loaded MONGODB_URI =>", process.env.MONGODB_URI);

const http = require("http");
const path = require("path");

/* ---------------- LOAD EXPRESS APP ---------------- */
const app = require(path.join(__dirname, "src", "app"));

/* ---------------- SERVER ---------------- */
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`LingoRush DB/Auth backend running on port ${PORT}`);
});
