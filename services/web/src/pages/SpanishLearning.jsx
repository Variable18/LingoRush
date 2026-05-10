// SpanishLearning.jsx
import { useEffect, useMemo, useState } from "react";
import { FaPaw } from "react-icons/fa";

/**
 * SpanishLearning.jsx
 * - Fun facts loader
 * - Mascot reactions
 * - Flashcards
 * - Drag & Drop sentence builder
 * - Word scramble mini-game
 * - Culture Corner
 *
 * Place your mascot/avatars in public/dogs/ and update DOG_IMG or AVATAR_IMAGES if needed.
 */

// ----- CONFIG / ASSETS -----
const DOG_IMG = "/dogs/chico.png"; // hero / mascot image (public/dogs/)
const AVATAR_IMAGES = [
  "/dogs/dog2_clean.png",
  "/dogs/dog3_clean.png",
  "/dogs/dog4_clean.png",
];

const SPANISH_FUN_FACTS = [
  "Spanish is the second most spoken native language in the world.",
  "There are more Spanish speakers in the USA than in Spain.",
  "Spanish uses inverted question marks (¿) and exclamation marks (¡) at the start of sentences.",
  "The Academy of the Spanish Language (RAE) regulates Spanish spelling and grammar.",
  "Castilian Spanish is the dialect spoken in central and northern Spain.",
];

const SPANISH_FLASHCARDS = [
  { id: 1, front: "hola", back: "hello — ¡Hola! ¿Cómo estás?", meta: "greeting" },
  { id: 2, front: "gracias", back: "thank you — Gracias por todo.", meta: "politeness" },
  { id: 3, front: "perro", back: "dog — El perro corre en el parque.", meta: "vocab" },
  { id: 4, front: "comer", back: "to eat — Me gusta comer paella.", meta: "verb" },
];

const DRAG_SENTENCES = [
  {
    id: 1,
    sentence: "Yo como manzanas todos los días.", // correct
    parts: ["Yo", "manzanas", "todos", "los", "día", "como", "los"], // scrambled (intentionally messy)
    hint: "I eat apples every day.",
  },
  {
    id: 2,
    sentence: "Ella está aprendiendo español.",
    parts: ["Ella", "español", "aprendiendo", "está"],
    hint: "She is learning Spanish.",
  },
];

const SCRAMBLE_WORDS = [
  { id: 1, word: "amigo", scrambled: "oigma" },
  { id: 2, word: "libro", scrambled: "briol" },
  { id: 3, word: "casa", scrambled: "saac" },
];

// ----- UTILS -----
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ----- COMPONENT -----
export default function SpanishLearning() {
  // page-level state
  const [loading, setLoading] = useState(true);
  const [fact, setFact] = useState("");
  const [mascotState, setMascotState] = useState("idle"); // idle | happy | sad | sleep
  const [xp, setXp] = useState(() => Number(localStorage.getItem("spanish_xp") || 0));
  const [paws, setPaws] = useState(() => Number(localStorage.getItem("spanish_paws") || 0));

  // flashcards
  const [cards] = useState(SPANISH_FLASHCARDS);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // drag & drop
  const [currentDragId, setCurrentDragId] = useState(0);
  const [dragSlots, setDragSlots] = useState([]);

  // scramble
  const [scrambleIndex, setScrambleIndex] = useState(0);
  const [scrambleGuess, setScrambleGuess] = useState("");

  // small effects: choose fact on mount
  useEffect(() => {
    setFact(pickRandom(SPANISH_FUN_FACTS));
    // mimic load using timeout; show loader for 1.2s to demonstrate fun fact
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  // persist xp/paws
  useEffect(() => {
    localStorage.setItem("spanish_xp", String(xp));
    localStorage.setItem("spanish_paws", String(paws));
  }, [xp, paws]);

  // helper to award xp/paws and show mascot reaction
  const award = (earnedXp = 10, earnedPaws = 1) => {
    setXp(prev => prev + earnedXp);
    setPaws(prev => prev + earnedPaws);
    setMascotState("happy");
    setTimeout(() => setMascotState("idle"), 800);
  };
  const penalize = () => {
    setMascotState("sad");
    setTimeout(() => setMascotState("idle"), 800);
  };

  /* -------------------------
     FLASHCARD HANDLERS
  ------------------------- */
  const flipCard = () => setFlipped(prev => !prev);
  const nextCard = (correct = false) => {
    setFlipped(false);
    if (correct) award(15, 1);
    else penalize();
    setCurrentCardIndex(i => (i + 1) % cards.length);
  };

  /* -------------------------
     DRAG & DROP HANDLERS
  ------------------------- */
  useEffect(() => {
    // initialize drag slots when drag id changes
    const dr = DRAG_SENTENCES[currentDragId] || DRAG_SENTENCES[0];
    setDragSlots(dr.parts.map(() => null));
  }, [currentDragId]);

  function onDragStart(e, word, idx) {
    e.dataTransfer.setData("text/plain", JSON.stringify({ word, idx }));
  }

  function onDropSlot(e, slotIndex) {
    e.preventDefault();
    const payload = JSON.parse(e.dataTransfer.getData("text/plain"));
    // place word into slotIndex
    setDragSlots(prev => {
      const next = [...prev];
      next[slotIndex] = payload.word;
      return next;
    });
  }

  function checkDragAnswer() {
    const dr = DRAG_SENTENCES[currentDragId] || DRAG_SENTENCES[0];
    const assembled = dragSlots.filter(Boolean).join(" ");
    if (assembled.replace(/\s+/g, " ").trim().toLowerCase() === dr.sentence.toLowerCase()) {
      award(25, 2);
    } else {
      penalize();
    }
  }

  /* -------------------------
     SCRAMBLE HANDLERS
  ------------------------- */
  const currentScramble = useMemo(() => SCRAMBLE_WORDS[scrambleIndex], [scrambleIndex]);
  function submitScramble() {
    if (!currentScramble) return;
    if (scrambleGuess.trim().toLowerCase() === currentScramble.word.toLowerCase()) {
      award(12, 1);
      setScrambleIndex(i => (i + 1) % SCRAMBLE_WORDS.length);
      setScrambleGuess("");
    } else {
      penalize();
    }
  }

  /* -------------------------
     UI SUB-COMPONENTS
  ------------------------- */
  function Loader() {
    return (
      <div className="w-full min-h-[220px] bg-white rounded-lg p-6 flex items-center gap-6">
        <div className="flex-1">
          <div className="text-lg font-semibold mb-2">Fun Fact</div>
          <div className="text-sm text-gray-600">{fact}</div>
        </div>
        <div className="w-36 h-36 flex items-center justify-center">
          <img src={DOG_IMG} alt="mascot" className="w-28" />
        </div>
      </div>
    );
  }

  function Mascot() {
    // simple class mapping for reactions
    const cls =
      mascotState === "happy" ? "mascot-happy" :
      mascotState === "sad" ? "mascot-sad" :
      mascotState === "sleep" ? "mascot-sleep" : "mascot-idle";

    return (
      <div className={`flex items-center gap-4`}>
        <div className={`w-24 h-24 rounded-full bg-white p-2 flex items-center justify-center shadow ${cls}`}>
          <img src={DOG_IMG} alt="mascot" className="w-full h-full object-contain" />
        </div>

        <div>
          <div className="text-sm text-gray-500">Mascot</div>
          <div className="text-lg font-semibold">Chico (Spanish)</div>
        </div>

        <style>{`
          /* mascot animations */
          .mascot-happy { animation: mascot-bounce 0.6s ease; }
          .mascot-sad { animation: mascot-shake 0.5s ease; filter: saturate(0.7); }
          .mascot-sleep { opacity: 0.6; transform: translateY(2px); filter: blur(0.3px); }
          @keyframes mascot-bounce { 0% { transform: translateY(0) } 50% { transform: translateY(-10px) } 100% { transform: translateY(0) } }
          @keyframes mascot-shake { 0%{ transform: translateX(0)} 25%{ transform: translateX(-6px)} 50%{ transform: translateX(6px)} 75%{ transform: translateX(-4px)} 100%{ transform: translateX(0)} }
        `}</style>
      </div>
    );
  }

  function FlashcardArea() {
    const card = cards[currentCardIndex];
    return (
      <div className="bg-white rounded-lg p-6 shadow">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-gray-400">Flashcards</div>
            <div className="text-sm text-gray-500">Card {currentCardIndex + 1} / {cards.length}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-700">XP: {xp}</div>
            <div className="flex items-center gap-1 text-yellow-500"><FaPaw />{paws}</div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="w-full h-36 rounded-lg bg-gray-50 p-6 flex items-center justify-center text-2xl font-bold select-none">
              {!flipped ? card.front : card.back}
            </div>
            <div className="mt-3 flex gap-3">
              <button onClick={flipCard} className="px-4 py-2 rounded bg-gray-200">Flip</button>
              <button onClick={() => nextCard(true)} className="px-4 py-2 rounded bg-green-500 text-white">I got it</button>
              <button onClick={() => nextCard(false)} className="px-4 py-2 rounded bg-red-500 text-white">Skip / wrong</button>
            </div>
          </div>

          <div className="w-32">
            <Mascot />
          </div>
        </div>
      </div>
    );
  }

  function DragDropArea() {
    const dr = DRAG_SENTENCES[currentDragId] || DRAG_SENTENCES[0];
    const sourceWords = dr.parts.concat([]); // shallow copy

    // words left in source = those not yet placed in any slot
    const placed = dragSlots.filter(Boolean);
    const remaining = sourceWords.filter(w => !placed.includes(w) || placed.filter(x => x === w).length < sourceWords.filter(x => x === w).length);

    return (
      <div className="bg-white rounded-lg p-6 shadow">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs text-gray-400">Sentence Builder</div>
            <div className="text-sm text-gray-500">{dr.hint}</div>
          </div>
          <div className="text-xs text-gray-400">Drag words into slots</div>
        </div>

        <div className="mb-4">
          {/* slots */}
          <div className="flex flex-wrap gap-2">
            {dragSlots.map((slot, idx) => (
              <div
                key={idx}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDropSlot(e, idx)}
                className="min-w-[100px] min-h-[40px] bg-gray-50 rounded p-2 flex items-center justify-center border"
              >
                {slot || <span className="text-gray-400">drop</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <div className="text-xs text-gray-400 mb-2">Words</div>
          <div className="flex flex-wrap gap-2">
            {remaining.map((w, i) => (
              <div
                draggable
                key={`${w}-${i}`}
                onDragStart={(e) => onDragStart(e, w, i)}
                className="px-3 py-1 bg-white rounded shadow cursor-grab"
              >
                {w}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={checkDragAnswer} className="px-4 py-2 rounded bg-indigo-600 text-white">Check</button>
          <button onClick={() => { setDragSlots(dr.parts.map(() => null)); setMascotState("idle"); }} className="px-4 py-2 rounded bg-gray-200">Reset</button>
          <button onClick={() => setCurrentDragId(i => (i + 1) % DRAG_SENTENCES.length)} className="px-4 py-2 rounded bg-gray-200">Next</button>
        </div>
      </div>
    );
  }

  function ScrambleArea() {
    return (
      <div className="bg-white rounded-lg p-6 shadow">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs text-gray-400">Word Scramble</div>
            <div className="text-sm text-gray-500">Unscramble the letters</div>
          </div>
          <div className="text-xs text-gray-400">Solve it!</div>
        </div>

        <div className="mb-3">
          <div className="text-2xl font-semibold">{currentScramble ? currentScramble.scrambled : "—"}</div>
          <div className="text-xs text-gray-400 mt-1">Scrambled word</div>
        </div>

        <div className="flex gap-2 mb-3">
          <input value={scrambleGuess} onChange={(e)=>setScrambleGuess(e.target.value)} className="flex-1 px-3 py-2 rounded border" placeholder="Type the word" />
          <button onClick={submitScramble} className="px-4 py-2 rounded bg-green-500 text-white">Submit</button>
        </div>

        <div className="text-xs text-gray-400">Hint: try common Spanish nouns</div>
      </div>
    );
  }

  function CultureCorner() {
    return (
      <div className="bg-white rounded-lg p-6 shadow">
        <div className="flex items-center justify-between mb-3">
          <div><div className="text-xs text-gray-400">Culture Corner</div><div className="text-sm text-gray-700">Spain & Spanish tips</div></div>
          <div className="text-xs text-gray-400">Short reads</div>
        </div>

        <ul className="space-y-3 text-sm text-gray-600">
          <li>
            <div className="font-semibold">Capital & region</div>
            <div>Spain's capital is Madrid; Spanish is also widely spoken in Latin America.</div>
          </li>
          <li>
            <div className="font-semibold">Etiquette</div>
            <div>In many Spanish speaking countries people greet with a handshake or a kiss on the cheek (country dependent).</div>
          </li>
          <li>
            <div className="font-semibold">Food</div>
            <div>Try <em>paella</em>, <em>tapas</em>, and churros con chocolate!</div>
          </li>
        </ul>
      </div>
    );
  }

  /* -------------------------
     RENDER
  ------------------------- */
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="max-w-[1200px] mx-auto px-6 py-8">

        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white p-2 flex items-center justify-center shadow">
              <img src={DOG_IMG} alt="mascot" className="w-full object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Spanish — Learn with Chico</h1>
              <div className="text-xs text-gray-500">Interactive lessons · Flashcards · Mini-games</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-700">XP: <span className="font-semibold">{xp}</span></div>
            <div className="flex items-center gap-1 text-yellow-500"><FaPaw />{paws}</div>
          </div>
        </div>

        {/* Loader / Fun fact */}
        {loading ? <Loader /> : null}

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

          {/* Left column: flashcards + culture */}
          <div className="lg:col-span-2 space-y-6">
            <FlashcardArea />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DragDropArea />
              <ScrambleArea />
            </div>

            <div>
              <CultureCorner />
            </div>
          </div>

          {/* Right column: avatars / tips */}
          <aside className="space-y-6">
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="text-sm text-gray-400 mb-2">Your Mascot</div>
              <Mascot />
              <div className="mt-3 flex gap-2">
                <button onClick={() => setMascotState("happy")} className="px-3 py-1 rounded bg-green-500 text-white">Cheer</button>
                <button onClick={() => setMascotState("sad")} className="px-3 py-1 rounded bg-red-500 text-white">Sad</button>
                <button onClick={() => setMascotState("sleep")} className="px-3 py-1 rounded bg-gray-200">Nap</button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow">
              <div className="text-sm text-gray-400 mb-2">Avatars</div>
              <div className="flex gap-3">
                {AVATAR_IMAGES.map((a, i) => (
                  <div key={i} className="w-16 h-16 rounded-full bg-gray-50 p-1 flex items-center justify-center">
                    <img src={a} alt={`avatar-${i}`} className="w-full h-full object-contain rounded-full" />
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-gray-500">Use these avatars on profile or badges.</div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow text-sm text-gray-700">
              <div className="font-semibold">Quick progress</div>
              <div className="text-xs text-gray-500 mt-1">Complete activities to earn XP & paws.</div>
              <div className="mt-3">
                <div className="h-2 bg-gray-200 rounded">
                  <div className="h-full bg-yellow-400 rounded" style={{ width: `${Math.min(100, xp)}%` }}></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Level progress (demo)</div>
              </div>
              <button onClick={() => { setXp(0); setPaws(0); }} className="mt-3 px-3 py-1 rounded bg-gray-200 text-sm">Reset</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
