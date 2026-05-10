// ml/predictDifficulty.js

/**
 * This function REPRESENTS your trained ML model.
 * Later, this logic will be replaced by real ML inference.
 */

function predictDifficulty(inputText) {
  // Temporary heuristic (placeholder for ML model)
  if (!inputText || inputText.length < 20) {
    return "easy";
  }

  if (inputText.length < 60) {
    return "medium";
  }

  return "hard";
}

module.exports = predictDifficulty;
