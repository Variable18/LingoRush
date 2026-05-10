import { useEffect, useState } from "react";

export default function DragDropGame({ level, difficulty, onResult }) {
  /* -------------------- STATE -------------------- */
  const [sentence, setSentence] = useState(null);
  const [slots, setSlots] = useState([]);
  const [bank, setBank] = useState([]);
  const [dragged, setDragged] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  /* -------------------- FETCH DATA -------------------- */
  useEffect(() => {
    setLoading(true);
    setError(false);
    setSubmitted(false);

    fetch(
      `http://localhost:8000/api/learn/german/dragdrop/${level}`
    )
      .then(res => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then(data => {
        setSentence(data);

        const wordCount = data.enWords.length;

        const slotCount =
          difficulty === "easy"
            ? wordCount + 1
            : difficulty === "medium"
            ? wordCount + 2
            : wordCount + 3;

        setSlots(Array(slotCount).fill(null));
        setBank(shuffle([...data.enWords]));
        setLoading(false);
      })
      .catch(err => {
        console.error("DragDrop fetch error:", err);
        setError(true);
        setLoading(false);
      });
  }, [level, difficulty]);

  /* -------------------- UTILS -------------------- */
  function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  function resetGame() {
    setSlots(slots.map(() => null));
    setBank(shuffle([...sentence.enWords]));
    setSubmitted(false);
  }

  /* -------------------- DRAG EVENTS -------------------- */
  function onDragStart(word) {
    setDragged(word);
  }

  function onDrop(index) {
    if (!dragged || slots[index]) return;

    const newSlots = [...slots];
    newSlots[index] = dragged;

    setSlots(newSlots);
    setBank(bank.filter(w => w !== dragged));
    setDragged(null);
  }

  /* -------------------- SUBMIT -------------------- */
  function submit() {
    if (submitted) return;

    const filled = slots.filter(Boolean);

    const isCorrect =
      filled.length === sentence.enWords.length &&
      filled.every((w, i) => w === sentence.enWords[i]);

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
        Arrange the correct English meaning
      </h2>

      {/* GERMAN SENTENCE */}
      <div className="mb-8 p-6 rounded-2xl bg-gray-100 text-center shadow-sm text-black">
        <p className="text-3xl font-bold tracking-wide text-black">
          {sentence.deSentence}
        </p>
      </div>

      {/* DROP ZONE */}
      <div className="mb-10">
        <p className="text-sm text-gray-500 mb-3 text-center">
          Drag the correct words into the slots below
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {slots.map((word, idx) => (
            <div
              key={idx}
              onDragOver={e => e.preventDefault()}
              onDrop={() => onDrop(idx)}
              className={`min-w-[90px] h-14 flex items-center justify-center
                rounded-xl border-2 transition
                ${
                  word
                    ? "bg-[rgb(var(--color-card-inverse))] text-white border-transparent"
                    : "border-dashed border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-main)]"
                }
              `}
            >
              {word || ""}
            </div>
          ))}
        </div>
      </div>

      {/* WORD BANK */}
      <div className="mb-10">
        <p className="text-sm text-gray-500 mb-3 text-center">
          Word Bank
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {bank.map(word => (
            <div
              key={word}
              draggable
              onDragStart={() => onDragStart(word)}
              className="px-4 py-2 rounded-full bg-white border text-black
                         cursor-grab active:cursor-grabbing transition
                         shadow-[0_8px_0_rgba(0,0,0,0.25)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_3px_0_rgba(0,0,0,0.25)] hover:bg-gray-100"
            >
              {word}
            </div>
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
