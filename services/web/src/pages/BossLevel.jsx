import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import DragDropGame from "../components/games/DragDropGame";
import ListeningGame from "../components/games/ListeningGame";
import MCQGame from "../components/games/MCQGame";
import SentenceBuilderGame from "../components/games/SentenceBuilderGame";
import WordMatchGame from "../components/games/WordMatchGame";

/* ---------------- CONFIG ---------------- */

const STAGES = [
  { id: 1, name: "Word Match", type: "wordmatch" },
  { id: 2, name: "Listening", type: "listening" },
  { id: 3, name: "MCQ", type: "mcq" },
  { id: 4, name: "Drag & Drop", type: "dragdrop" },
  { id: 5, name: "Sentence", type: "sentence" }
];

const TOTAL_TIME = 180;

/* ---------------- COMPONENT ---------------- */

export default function BossLevel({ onFinish }) {
  /* ✅ ALL HOOKS ARE HERE */
  const { level } = useParams();
  const [searchParams] = useSearchParams();

  const isPractice = searchParams.get("mode") === "practice";
  const bossLevel = Number(level);

  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [currentStage, setCurrentStage] = useState(0);
  const [results, setResults] = useState(Array(5).fill(null));
  const [stagesData, setStagesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const timerRef = useRef(null);

  /* ---------------- FETCH BOSS DATA ---------------- */
  useEffect(() => {
    setLoading(true);
    setError(false);

    fetch(`http://localhost:8000/api/learn/german/boss/${bossLevel}`)
      .then(res => {
        if (!res.ok) throw new Error("Boss fetch failed");
        return res.json();
      })
      .then(data => {
        setStagesData({
          wordmatch: Array.isArray(data.wordPairs) ? data.wordPairs : [],
          listening: Array.isArray(data.listeningPairs) ? data.listeningPairs : [],
          mcq: Array.isArray(data.mcqPairs) ? data.mcqPairs : []
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Boss fetch error:", err);
        setError(true);
        setLoading(false);
      });
  }, [bossLevel]);

  /* ---------------- TIMER (DISABLED IN PRACTICE) ---------------- */
  useEffect(() => {
    if (isPractice) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          onFinish(results);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isPractice, results, onFinish]);

  /* ---------------- STAGE RESULT ---------------- */
  function handleResult(passed) {
    const updated = [...results];
    updated[currentStage] = passed;
    setResults(updated);

    if (currentStage < STAGES.length - 1) {
      setCurrentStage(prev => prev + 1);
    } else {
      clearInterval(timerRef.current);
      onFinish(updated);
    }
  }

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[var(--color-bg-base)] flex items-center justify-center text-[var(--color-text-main)]">
        Loading boss challenge...
      </div>
    );
  }

  if (error || !stagesData) {
    return (
      <div className="min-h-screen w-full bg-[var(--color-bg-base)] flex items-center justify-center text-red-500">
        Failed to load boss challenge.
      </div>
    );
  }

  /* ---------------- ACTIVE GAME ---------------- */
  function renderStage() {
    const stage = STAGES[currentStage];

    switch (stage.type) {
      case "wordmatch":
        return (
          <WordMatchGame
            content={stagesData.wordmatch}
            onResult={handleResult}
          />
        );

      case "listening":
        return (
          <ListeningGame
            content={stagesData.listening}
            onResult={handleResult}
          />
        );

      case "mcq":
        return (
          <MCQGame
            content={stagesData.mcq}
            onResult={handleResult}
          />
        );

      case "dragdrop":
        return (
          <DragDropGame
            level={bossLevel}
            difficulty="mixed"
            onResult={handleResult}
          />
        );

      case "sentence":
        return (
          <SentenceBuilderGame
            level={bossLevel}
            difficulty="mixed"
            onResult={handleResult}
          />
        );

      default:
        return null;
    }
  }

  /* ---------------- UI ---------------- */
  const percentage = (timeLeft / TOTAL_TIME) * 100;
  const barColor =
    percentage > 60
      ? "bg-green-500"
      : percentage > 30
      ? "bg-yellow-400"
      : "bg-red-600";

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[var(--color-bg-base)] via-[var(--color-bg-subtle)] to-[var(--color-bg-base)] text-[var(--color-text-main)] px-4 py-8 overflow-x-hidden">
      <h1 className="text-3xl font-bold mb-6 text-center tracking-wider">
        BOSS CHALLENGE {isPractice && "(Practice)"}
      </h1>

      {!isPractice && (
        <div className="mb-6 h-3 w-full bg-gray-800 rounded overflow-hidden">
          <div
            className={`h-full ${barColor}`}
            style={{ width: `${percentage}%`, marginLeft: "auto" }}
          />
        </div>
      )}

      <div className="flex gap-2 mb-8 max-w-5xl mx-auto">
        {STAGES.map((s, idx) => (
          <div
            key={s.id}
            className={`flex-1 py-2 rounded-lg text-center text-xs font-semibold
              ${
                results[idx] === true
                  ? "bg-green-600"
                  : results[idx] === false
                  ? "bg-red-600"
                  : idx === currentStage
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-700"
              }`}
          >
            {s.name}
          </div>
        ))}
      </div>

      <div className="bg-white text-black rounded-2xl p-4 shadow-2xl max-w-4xl mx-auto">
        {renderStage()}
      </div>
    </div>
  );
}
