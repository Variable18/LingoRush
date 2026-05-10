export function getDifficulty(level) {
  if (level <= 10) return "easy";
  if (level <= 20) return "medium";
  return "hard";
}

export function getGameType(level) {
  const games = [
    "word_match",
    "mcq",
    "fill_blank",
    "sentence_builder"
  ];
  return games[(level - 1) % games.length];
}

export async function fetchLevelTask(level) {
  const res = await fetch(
    `http://localhost:8000/ml/next-task?language=german&level=${level}`
  );
  return res.json();
}
