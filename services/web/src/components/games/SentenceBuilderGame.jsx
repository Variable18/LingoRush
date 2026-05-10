import { useEffect, useState } from "react";

export default function SentenceBuilderGame({ level, difficulty, onResult }) {
  /* -------------------- STATE -------------------- */
  const [sentence, setSentence] = useState(null);
  const [built, setBuilt] = useState([]);
  const [pool, setPool] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  /* -------------------- FETCH DATA -------------------- */
  useEffect(() => {
    setLoading(true);
    setError(false);
    setSubmitted(false);

    fetch(
      `http://localhost:8000/api/learn/german/sentence/${level}`
    )
      .then(res => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then(data => {
        setSentence(data);
        setBuilt([]);
        setPool(shuffle([...data.deWords]));
        setLoading(false);
      })
      .catch(err => {
        console.error(
          "SentenceBuilder fetch error:",
          err
        );
        setError(true);
        setLoading(false);
      });
  }, [level]);

  /* -------------------- UTILS -------------------- */
  function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  function resetGame() {
    setBuilt([]);
    setPool(shuffle([...sentence.deWords]));
    setSubmitted(false);
  }

  /* -------------------- WORD ACTIONS -------------------- */
  function addWord(word) {
    if (submitted) return;

    setBuilt(prev => [...prev, word]);
    setPool(prev => prev.filter(w => w !== word));
  }

  function removeWord(index) {
    if (submitted) return;

    const word = built[index];
    setBuilt(prev => prev.filter((_, i) => i !== index));
    setPool(prev => [...prev, word]);
  }

  /* -------------------- SUBMIT -------------------- */
  function submit() {
    if (submitted) return;

    const isCorrect =
      built.length === sentence.deWords.length &&
      built.every((w, i) => w === sentence.deWords[i]);

    if (isCorrect) {
      setSubmitted(true);
      onResult(true);
    } else {
      resetGame();
    }
  }

  /* -------------------- STATES -------------------- */
  if (loading) {
    return (
      <p className="text-center mt-20">
        Loading game...
      </p>
    );
  }

  if (error || !sentence) {
    return (
      <p className="text-center mt-20 text-red-600">
        Failed to load game.
      </p>
    );
  }

  /* -------------------- UI -------------------- */
  return (
    <div className="max-w-3xl mx-auto">
      {/* TITLE */}
      <h2 className="text-xl font-semibold mb-6 text-center">
        Build the correct German sentence
      </h2>

      {/* ENGLISH MEANING */}
      <div className="mb-8 p-6 rounded-2xl bg-gray-100 text-center shadow-sm text-black">
        <p className="text-2xl font-medium text-black">
          {sentence.enSentence}
        </p>
      </div>

      {/* BUILT SENTENCE */}
      <div className="mb-10">
        <p className="text-sm text-gray-500 mb-3 text-center">
          Tap words to form the sentence
        </p>

        <div
          className="min-h-[64px] flex flex-wrap justify-center gap-3
                     border-2 border-dashed border-gray-300
                     rounded-xl p-4"
        >
          {built.length === 0 && (
            <span className="text-gray-400">
              Sentence will appear here
            </span>
          )}

          {built.map((word, idx) => (
            <button
              key={`${word}-${idx}`}
              onClick={() => removeWord(idx)}
              className="px-4 py-2 rounded-full bg-[rgb(var(--color-card-inverse))] text-white
                         hover:opacity-90 transition"
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      {/* WORD POOL */}
      <div className="mb-10">
        <p className="text-sm text-gray-500 mb-3 text-center">
          Available Words
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {pool.map(word => (
            <button
              key={word}
              onClick={() => addWord(word)}
              className="px-4 py-2 rounded-full bg-white border text-black
                         hover:bg-gray-100 transition shadow-[0_8px_0_rgba(0,0,0,0.25)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_3px_0_rgba(0,0,0,0.25)]"
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      {/* SUBMIT */}
      <div className="flex justify-center">
        <button
          onClick={submit}
          className="px-8 py-3 rounded-xl bg-[rgb(var(--color-card-inverse))] text-white
                     hover:opacity-90 transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
