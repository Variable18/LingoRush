import bossIcon from "../../assets/levelmap/boss.webp";
import { useTheme } from "../../context/ThemeContext";

export default function LevelButton({
  level,
  x,
  y,
  state,
  boss,
  onClick,
}) {
  const { theme } = useTheme();

  // Theme-specific styles
  const isDark = theme === 'dark';

  let base;
  if (state === "completed") {
    // Dark mode: Black button | Light mode: Standard inverse (Black)
    base = isDark ? "bg-black text-white border border-gray-800" : "bg-[rgb(var(--color-card-inverse))] text-white";
  } else if (state === "current") {
    // Current is always bright white/green
    base = "bg-white text-black ring-4 ring-[#00E676] animate-pulse";
  } else {
    // Locked
    // Dark mode: Grey background, White text
    // Light mode: Standard subtle bg, Black text
    base = isDark 
      ? "bg-gray-700 text-white cursor-not-allowed" 
      : "bg-[var(--color-bg-subtle)] text-[rgb(var(--color-text-main))] cursor-not-allowed opacity-50";
  }

  return (
    <button
      onClick={onClick}
      disabled={state === "locked"}
      className={`absolute w-20 h-20 rounded-xl overflow-hidden font-bold transition
        ${base}
        shadow-[0_8px_0_rgba(0,0,0,0.6),0_15px_25px_rgba(0,0,0,0.35)]
        hover:-translate-y-1
        active:translate-y-[6px]
        active:shadow-[0_2px_0_rgba(0,0,0,0.6),0_6px_10px_rgba(0,0,0,0.35)]
      `}
      style={{ left: x, top: y }}
    >
      {/* 🔥 BOSS IMAGE */}
      {boss ? (
        <img
          src={bossIcon}
          alt="Boss Level"
          className="w-full h-full object-cover rounded-xl"
        />
      ) : (
        <span className="relative z-10 text-xl">
          {level}
        </span>
      )}
    </button>
  );
}
