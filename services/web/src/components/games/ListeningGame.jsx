import { useEffect, useMemo, useRef, useState } from "react";

export default function ListeningGame({ content, difficulty, onResult }) {
  const question = content[0];

  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [wrongOpt, setWrongOpt] = useState(null);
  const [playing, setPlaying] = useState(false);

  const utteranceRef = useRef(null);

  /* -------------------- OPTIONS -------------------- */
  const options = useMemo(() => {
    return [...content.map(c => c.en)].sort(() => Math.random() - 0.5);
  }, [content]);

  /* -------------------- VOICE -------------------- */
  function getVoice(lang) {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find(v => v.lang === lang && v.name.toLowerCase().includes("female")) ||
      voices.find(v => v.lang === lang)
    );
  }

  /* -------------------- AUDIO -------------------- */
  function playAudio() {
    if (answered) return;

    window.speechSynthesis.cancel();

    const rate =
      difficulty === "easy" ? 0.75 :
      difficulty === "medium" ? 0.9 :
      1.0;

    const text =
      difficulty === "easy"
        ? question.de.split(" ").join("... ")
        : question.de;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "de-DE";
    utterance.rate = rate;
    utterance.voice = getVoice("de-DE");

    utterance.onstart = () => setPlaying(true);
    utterance.onend = () => setPlaying(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }

  /* -------------------- SUBMIT -------------------- */
  function submit() {
    if (answered || !selected) return;

    window.speechSynthesis.cancel();

    if (selected === question.en) {
      setAnswered(true);
      onResult(true);
    } else {
      setWrongOpt(selected);
      // brief feedback, then allow retry
      setTimeout(() => {
        setWrongOpt(null);
        setSelected(null);
      }, 900);
    }
  }

  /* -------------------- CLEANUP -------------------- */
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  /* -------------------- UI -------------------- */
  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">
        Listen carefully and choose the correct meaning
      </h2>

      {/* AUDIO CARD */}
      <div className="mb-6 p-5 bg-gray-100 rounded-xl flex items-center justify-between text-black">
        <span className="font-medium text-black">Audio</span>

        <button
          onClick={playAudio}
          disabled={playing || answered}
          className="px-4 py-2 rounded bg-[rgb(var(--color-card-inverse))] text-white disabled:opacity-50"
        >
          {playing ? "Playing..." : "▶ Play"}
        </button>
      </div>

      {/* OPTIONS */}
      <div className="space-y-3">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => setSelected(opt)}
            disabled={answered}
            className={`w-full py-3 border rounded transition text-black
              ${!answered && selected === opt ? "bg-gray-200 border-black" : "bg-white hover:bg-gray-100"}
              ${answered && opt === question.en ? "!bg-green-600 !text-white !border-green-600" : ""}
              ${!answered && wrongOpt === opt ? "!bg-red-600 !text-white !border-red-600" : ""}
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
