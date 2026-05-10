const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

async function postJson(path, body, token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });
  const json = await res.json();
  if (!res.ok) {
    const err = new Error(json.error || "API error");
    err.data = json;
    throw err;
  }
  return json;
}

export default {
  async signup({ email, password, name }) {
    return await postJson("/api/v1/auth/signup", { email, password, name });
  },

  async login({ email, password }) {
    return await postJson("/api/v1/auth/login", { email, password });
  },

  // helper to call protected endpoints
  async getProfile(token) {
    const res = await fetch(`${API_BASE}/api/v1/me`, { // create route if needed
      headers: { Authorization: `Bearer ${token}` }
    });
    return await res.json();
  }
};

export async function fetchLeaderboard(token) {
  const res = await fetch(`${API_BASE}/api/progress/leaderboard`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  return res.json();
}

export async function fetchLevelQuiz(language, level) {
  const res = await fetch(
    `http://localhost:5000/api/level-quiz?language=${language}&level=${level}`
  );
  return res.json();
}

export async function submitLevelResult(payload) {
  const res = await fetch(
    `http://localhost:5000/api/level-submit`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }
  );
  return res.json();
}
