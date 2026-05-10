import { useMemo, useState } from "react";

export default function MCQGame({ content, difficulty, onResult }) {
  const question = content[0];

  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  /* -------------------- OPTIONS -------------------- */
  const options = useMemo(() => {
    return [...content.map(c => c.en)].sort(() => Math.random() - 0.5);
  }, [content]);

  /* -------------------- SUBMIT -------------------- */
  function submit() {
    if (answered || !selected) return;

    setAnswered(true);
    onResult(selected === question.en);
  }

  /* -------------------- DIFFICULTY UI -------------------- */
  const hint =
    difficulty === "easy"
      ? "Focus on the highlighted word"
      : difficulty === "medium"
      ? "Choose the best meaning"
      : null;

  /* -------------------- UI -------------------- */
  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">
        Choose the correct meaning
      </h2>

      {/* QUESTION CARD */}
      <div className="mb-6 p-5 bg-gray-100 rounded-xl text-center text-black">
        <p className="text-2xl font-bold tracking-wide text-black">
          {question.de}
        </p>
      </div>

      {/* HINT */}
      {hint && !answered && (
        <p className="text-sm text-gray-500 mb-3 text-center">
          {hint}
        </p>
      )}

      {/* OPTIONS */}
      <div className="space-y-3">
        {options.map(opt => (
          <button
            key={opt}
            disabled={answered}
            onClick={() => setSelected(opt)}
            className={`w-full py-3 border rounded text-black transition
              ${!answered && selected === opt ? "bg-gray-200 border-black" : "bg-white hover:bg-gray-100"}
              ${answered && opt === question.en ? "!bg-green-600 !text-white !border-green-600" : ""}
              ${answered && selected === opt && opt !== question.en ? "!bg-red-600 !text-white !border-red-600" : ""}
              ${answered ? "cursor-not-allowed" : "shadow-[0_8px_0_rgba(0,0,0,0.25)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_3px_0_rgba(0,0,0,0.25)]"}
            `}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* SUBMIT */}
      {!answered && (
        <button
          onClick={submit}
          disabled={!selected}
          className="mt-6 w-full py-3 rounded bg-[rgb(var(--color-card-inverse))] text-white disabled:opacity-40 shadow-[0_8px_0_rgba(0,0,0,0.4)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_3px_0_rgba(0,0,0,0.4)] transition"
        >
          Submit
        </button>
      )}
    </div>
  );
}
