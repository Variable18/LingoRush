import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

export default function WordMatchGame({ content = [], onResult }) {
  const { theme } = useTheme();
  const [german, setGerman] = useState([]);
  const [english, setEnglish] = useState([]);
  const [selected, setSelected] = useState(null);
  const [matchedGerman, setMatchedGerman] = useState([]);
  const [matchedEnglish, setMatchedEnglish] = useState([]);
  const [wrong, setWrong] = useState(null);

  /* ---------------- SAFE SHUFFLE ---------------- */
  function shuffle(arr) {
    if (!Array.isArray(arr)) return [];
    return [...arr].sort(() => Math.random() - 0.5);
  }

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    if (!Array.isArray(content) || content.length === 0) return;

    setGerman(shuffle(content));
    setEnglish(shuffle(content));
    setSelected(null);
    setMatchedGerman([]);
    setMatchedEnglish([]);
    setWrong(null);
  }, [content]);

  /* ---------------- HANDLERS ---------------- */

  function selectGerman(word) {
    if (!matchedGerman.includes(word.de)) {
      setSelected(word);
      setWrong(null);
    }
  }

  function selectEnglish(word) {
    if (!selected) return;

    if (selected.en === word.en) {
      const newGerman = [...matchedGerman, selected.de];
      const newEnglish = [...matchedEnglish, word.en];

      setMatchedGerman(newGerman);
      setMatchedEnglish(newEnglish);
      setSelected(null);
      setWrong(null);

      if (newGerman.length === german.length) {
        onResult(true);
      }
    } else {
      setWrong({ de: selected.de, en: word.en });

      setTimeout(() => {
        setWrong(null);
        setSelected(null);
      }, 600);
    }
  }

  /* ---------------- GUARD ---------------- */
  if (!german.length || !english.length) {
    return (
      <p className="text-center text-gray-500">
        Loading word match...
      </p>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div>
      <h2 className="text-lg font-semibold mb-6 text-center">
        Match the German word with its meaning
      </h2>

      <div className="grid grid-cols-2 gap-8">
        {/* German */}
        <div>
          {german.map(w => (
            <button
              key={w.de}
              onClick={() => selectGerman(w)}
              disabled={matchedGerman.includes(w.de)}
              className={`w-full py-3 mb-3 rounded font-medium transition
                ${
                  matchedGerman.includes(w.de)
                    ? "bg-green-600 text-white"
                    : wrong?.de === w.de
                    ? "bg-red-600 text-white"
                    : selected?.de === w.de
                    ? "bg-gray-700 text-white"
                    : theme === "dark"
                    ? "bg-[rgba(255,255,255,0.9)] text-black font-bold border-2 border-transparent hover:bg-white"
                    : "bg-[rgb(var(--color-card-inverse))] text-white"
                }`}
            >
              {w.de}
            </button>
          ))}
        </div>

        {/* English */}
        <div>
          {english.map(w => (
            <button
              key={w.en}
              onClick={() => selectEnglish(w)}
              disabled={matchedEnglish.includes(w.en)}
              className={`w-full py-3 mb-3 rounded border transition text-black
                ${
                  matchedEnglish.includes(w.en)
                    ? "border-2 border-green-600 bg-green-50 text-green-700"
                    : wrong?.en === w.en
                    ? "bg-red-100 border-red-500 text-red-700"
                    : "bg-white shadow-[0_8px_0_rgba(0,0,0,0.25)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_3px_0_rgba(0,0,0,0.25)]"
                }`}
            >
              {w.en}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
