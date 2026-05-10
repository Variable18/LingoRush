const { spawn } = require("child_process");

function predictDifficulty(text) {
  return new Promise((resolve, reject) => {
    const py = spawn("python", ["ml/predict_cli.py", text]);

    let output = "";

    py.stdout.on("data", (data) => {
      output += data.toString();
    });

    py.stderr.on("data", (err) => {
      reject(err.toString());
    });

    py.on("close", () => {
      resolve(output.trim());
    });
  });
}

module.exports = predictDifficulty;
