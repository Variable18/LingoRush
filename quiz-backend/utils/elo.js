function expectedProbability(s_user, s_question) {
  return 1 / (1 + Math.pow(10, (s_question - s_user) / 400));
}

function updateRatings(s_user, s_question, result, K_user = 24, K_question = 8) {
  // result: 1 for correct, 0 for incorrect
  const P = expectedProbability(s_user, s_question);
  const s_user_new = s_user + K_user * (result - P);
  const s_question_new = s_question + K_question * (P - result);
  return { s_user_new, s_question_new, expected: P };
}

module.exports = { expectedProbability, updateRatings };
