import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bondIcon from "../assets/bond-xp.webp";
import germanFlag from "../assets/flags/german.webp";
import pawIcon from "../assets/paws.webp";
import ChatbotPlaceholder from "../components/ChatbotPlaceholder";
import LevelButton from "../components/levelmap/LevelButton";
import PawTrail from "../components/levelmap/PawTrail";
import SideNavbar from "../components/SideNavbar";
import TopBar from "../components/TopBar";
import styles from "./LandingNew.module.css";


/* ---------------- CONFIG ---------------- */

const TOTAL_LEVELS = 30;
const STEPS_PER_SEGMENT = 4;
const LEVEL_GAP = 140; // spacing between levels (more breathing room)
const BOSS_LEVELS = [11, 22];

/* ---------------- LANGUAGE FACTS ---------------- */

const germanFacts = [
  "German is the most widely spoken native language in Europe.",
  "All German nouns start with a capital letter.",
  "German allows extremely long compound words like Donaudampfschifffahrtsgesellschaft.",
  "There are over 20 major dialect groups in German.",
  "The word 'Schadenfreude' has no exact English translation.",
  "German has three genders: masculine, feminine, and neuter.",
  "The German alphabet has extra letters like ä, ö, ü, and ß.",
  "Mark Twain once joked that learning German was a lifelong task.",
  "German grammar allows flexible sentence structure.",
  "Many English words like ‘kindergarten’ and ‘rucksack’ come from German."
];


/* ---------------- COMPONENT ---------------- */

export default function GermanLevels() {
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);

  /* Progress from backend */
  const [completedLevels, setCompletedLevels] = useState([]);
  const [xp, setXp] = useState(0);
  const [paws, setPaws] = useState(0);

  /* Map animation */
  const [globalStep, setGlobalStep] = useState(0);

  /* Fact animation */
  const [factIndex, setFactIndex] = useState(0);
  const [factVisible, setFactVisible] = useState(true);

  /* ---------------- LEVEL NODE GENERATION ---------------- */

  const levelNodes = Array.from({ length: TOTAL_LEVELS }, (_, i) => ({
    level: i + 1,
    x: 260 + (i % 2 === 0 ? -120 : 120),
    y: 80 + i * LEVEL_GAP,
  }));

  const TOTAL_PAW_STEPS =
    (levelNodes.length - 1) * STEPS_PER_SEGMENT;

  /* ---------------- FETCH PROGRESS ---------------- */

  useEffect(() => {
    fetch("http://localhost:5000/api/progress/german", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(
          "lingorush_token"
        )}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setCompletedLevels(data.completedLevels || []);
        setXp(data.xp || 0);
        setPaws(data.paws || 0);
      })
      .catch(err =>
        console.error("Progress fetch error:", err)
      );
  }, []);

  /* ---------------- CURRENT LEVEL ---------------- */

  const currentLevel =
    completedLevels.length > 0
      ? Math.max(...completedLevels) + 1
      : 1;

  /* ---------------- PAW ANIMATION ---------------- */

  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalStep(prev => (prev + 1) % TOTAL_PAW_STEPS);
    }, 350);

    return () => clearInterval(interval);
  }, [TOTAL_PAW_STEPS]);

  /* ---------------- FACT ROTATION ---------------- */

  useEffect(() => {
    const factInterval = setInterval(() => {
      setFactVisible(false);
      setTimeout(() => {
        setFactIndex(i => (i + 1) % germanFacts.length);
        setFactVisible(true);
      }, 300);
    }, 5000);

    return () => clearInterval(factInterval);
  }, []);

  /* ---------------- HELPERS ---------------- */

  function isBoss(level) {
    return BOSS_LEVELS.includes(level);
  }

  /* ---------------- RENDER ---------------- */

  return (
    <div className={`${styles.page} motion-fade-in`} style={{ backgroundColor: "transparent" }}>
      <TopBar navOpen={navOpen} />
      <SideNavbar onOpenChange={setNavOpen} />
      <div 
        className="transition-all duration-300"
        style={{ paddingLeft: navOpen ? 280 : 0 }}
      >
      <main className={`${styles.container} motion-fade-up`} style={{ position: "relative", overflow: "hidden", '--dur-base': '420ms', '--easing-soft': 'var(--easing-deluxe)', paddingTop: 88, maxWidth: 1600 }}>
        {/* Subtle radial backdrop */}
        <div aria-hidden className="bg-drift-medium bg-pulse" style={{ position: 'absolute', inset: '-10%', background: 'radial-gradient(40% 30% at 60% 0%, rgba(0,0,0,0.05), transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />

        {/* Title: GERMAN (classic style) */}
        <h1
          className="text-center mb-10 select-none motion-fade-up"
          style={{
            fontSize: "72px",
            fontWeight: 900,
            letterSpacing: "6px",
            textTransform: "uppercase",
            color: "rgb(var(--color-text-main))",
            textShadow: `
              0 1px 0 var(--color-text-muted),
              0 2px 0 var(--color-text-muted),
              0 6px 12px rgba(0,0,0,0.25)
            `,
          }}
        >
          GERMAN
        </h1>

        {/* 3 COLUMN LAYOUT (extremes left/right, center map) */}
        <div className="flex justify-between gap-10">
        {/* LEFT */}
        {/* LEFT COLUMN */}
<div className="w-[420px]">
  <div className="sticky top-32 flex flex-col gap-6">

    {/* DID YOU KNOW CARD (no hover, dark card) */}
    <div
      className={`transition-all duration-500 motion-fade-up
        ${factVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
      `}
    >
      <div
        className="relative rounded-2xl p-6 overflow-hidden"
        style={{
          background: 'var(--surface)',
          color: 'var(--text)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
          border: '1px solid var(--line)'
        }}
      >
        {/* Accent bar removed per request */}

        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full overflow-hidden shadow">
            <img
              src={germanFlag}
              alt="German Flag"
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>

          <h3 className="font-extrabold text-sm uppercase tracking-wider" style={{ color: 'var(--text)' }}>
            Did you know?
          </h3>
        </div>

        {/* Fact text */}
        <p className="text-base leading-relaxed pl-12" style={{ color: 'var(--text)' }}>
          {germanFacts[factIndex]}
        </p>

        {/* Progress dots */}
        <div className="flex gap-2 mt-4 pl-12">
          {germanFacts.map((_, i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full transition"
              style={{
                background: i === factIndex ? 'var(--accent)' : 'var(--color-text-muted)'
              }}
            />
          ))}
        </div>

        {/* Glow */}
        <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full blur-3xl" style={{ background: 'var(--accent-weak)' }} />
      </div>
    </div>

    {/* PROGRESS CARD (dark card, green bars, white text) */}
    <div
      className="relative rounded-2xl p-6 motion-fade-up overflow-hidden"
      style={{ background: 'var(--surface)', color: 'var(--text)', boxShadow: '0 20px 40px rgba(0,0,0,0.25)', border: '1px solid var(--line)' }}
    >
      {/* Accent bar removed per request */}

      <h3 className="font-extrabold text-lg mb-6" style={{ color: 'var(--text)' }}>
        Your Progress
      </h3>

      {/* PAWS */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <img src={pawIcon} alt="Paws" width={28} />
            <span className="font-semibold" style={{ color: 'var(--text)' }}>
              Paws Collected
            </span>
          </div>
          <span className="font-bold" style={{ color: 'var(--text)' }}>{paws}</span>
        </div>

        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-bg-subtle)' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.min((paws / TOTAL_LEVELS) * 100, 100)}%`,
              backgroundImage: 'linear-gradient(90deg, #16a34a, #22c55e)'
            }}
          />
        </div>

        <div className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
          Earn paws by completing levels
        </div>
      </div>

      {/* XP */}
      <div>
          <div className="flex items-center justify-between mb-2" style={{ color: 'var(--text)' }}>
          <div className="flex items-center gap-3">
            <img src={bondIcon} alt="XP" width={28} />
            <span className="font-semibold">
              Bond XP
            </span>
          </div>
          <span className="font-bold">{xp}</span>
        </div>

        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-bg-subtle)' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.min((xp / 1000) * 100, 100)}%`,
              backgroundImage: 'linear-gradient(90deg, #16a34a, #22c55e)'
            }}
          />
        </div>

        <div className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
          Next bond at <b>1000 XP</b>
        </div>
      </div>

      {/* Glow */}
      <div className="absolute -bottom-16 -right-16 w-48 h-48
        bg-blue-500/10 rounded-full blur-3xl"
      />
    </div>

  </div>
</div>

        {/* CENTER MAP */}
        <div className="relative w-[600px] motion-fade-up" style={{ height: `${160 + (TOTAL_LEVELS - 1) * LEVEL_GAP}px` }}>
          {levelNodes.slice(0, -1).map((node, i) => (
            <PawTrail
              key={i}
              from={node}
              to={levelNodes[i + 1]}
              segmentIndex={i}
              globalStep={globalStep}
            />
          ))}

          {levelNodes.map(node => {
            const completed =
              completedLevels.includes(node.level);

            const state = completed
              ? "completed"
              : node.level === currentLevel
              ? "current"
              : "locked";

            const boss = isBoss(node.level);

            // Ensure boss levels are revisitable even if backend doesn't mark them in completedLevels
            // If the boss level is before the current level, treat it as completed for practice revisit.
            const effectiveState = boss && node.level < currentLevel ? "completed" : state;

            return (
              <LevelButton
                key={node.level}
                {...node}
                state={effectiveState}
                boss={boss}
                onClick={() => {
                  if (effectiveState === "locked") return;

                  // ✅ completed normal level → practice
                  if (effectiveState === "completed") {
                    navigate(
                      `/learn/german/level/${node.level}?mode=practice`
                    );
                  } 
                  // ✅ current level → play
                  else {
                    navigate(
                      `/learn/german/level/${node.level}`
                    );
                  }
                }}
              />
            );
          })}
        </div>

        {/* RIGHT (reserve space so center slides smoothly) */}
        <div className={`w-[340px]`} style={{ visibility: navOpen ? 'hidden' : 'visible' }}>
          <div className="sticky top-32 flex flex-col gap-4">
            {/* PRO */}
            <div
  className="relative rounded-2xl p-5 motion-fade-up overflow-hidden"
  style={{ background: 'var(--surface)', color: 'var(--text)', boxShadow: '0 20px 40px rgba(0,0,0,0.25)', border: '1px solid var(--line)' }}
>
  {/* Gold glow */}
  <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl" style={{ background: 'var(--accent-weak)' }} />

  {/* Header */}
  <div className="flex items-center gap-3 mb-2">
    <div className="w-10 h-10 rounded-full
      bg-gradient-to-br from-yellow-400 to-yellow-600
      text-black font-extrabold flex items-center justify-center"
    >
      ★
    </div>

    <h3 className="text-lg font-extrabold tracking-wide" style={{ color: 'var(--text)' }}>Premium Access</h3>
  </div>
  {/* Compact: two lines + button */}
  <p className="text-sm mb-3" style={{ color: 'var(--text)' }}>
    Unlock AI insights and custom learning paths.
  </p>

  <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
    Upgrade for a focused, ad‑free experience.
  </p>

  {/* CTA BUTTON */}
  <button className="btn-base btn-accent btn-sheen w-full">Subscribe</button>
</div>

            {/* Chatbot below subscription */}
            <ChatbotPlaceholder />


            
          </div>
          </div>
        </div>
        </main>
      </div>
    </div>
  );
}
