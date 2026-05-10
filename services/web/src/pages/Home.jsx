import { useEffect, useMemo, useState } from "react";
import SideNavbar from "../components/SideNavbar";
import LanguageCard from "../components/LanguageCard";
import ChatbotPlaceholder from "../components/ChatbotPlaceholder";
import TopBar from "../components/TopBar";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaRedo, FaChartLine } from "react-icons/fa";
import styles from "./LandingNew.module.css";

import flagFR from "../assets/flags/france.webp";
import flagDE from "../assets/flags/german.webp";
import flagPT from "../assets/flags/portugal.webp";
import flagSA from "../assets/flags/saudi.webp";
import flagES from "../assets/flags/spain.webp";

// Landing-like palette for Home while preserving animations
const COLORS = {
  BLACK: "transparent", 
  DARK_BLUE: "var(--color-bg-card)", // Auto-switches White <-> Grey
  WHITE: "var(--color-text-main)",   // Auto-switches Black <-> White
  MUTED: "var(--color-text-muted)",
  RED: "var(--accent)", 
  GOLD: "#C9A24D",
};

const LANGUAGES = [
  { title: "German", flag: flagDE, difficulty: "Intermediate" },
  { title: "Spanish", flag: flagES, difficulty: "Beginner" },
  { title: "French", flag: flagFR, difficulty: "Intermediate" },
  { title: "Portuguese", flag: flagPT, difficulty: "Beginner" },
  { title: "Arabic", flag: flagSA, difficulty: "Advanced" },
];

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const [languages, setLanguages] = useState(LANGUAGES);
  const [stats, setStats] = useState({ xp: 2450, levels: 18, streak: 7 });

  useEffect(() => {
    const token = localStorage.getItem("lingorush_token");
    const storedUser = JSON.parse(localStorage.getItem("lingorush_user"));
    if (!storedUser) return;
    setUser(storedUser);
    fetch("http://localhost:5000/api/progress/german", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        const completed = data.completedLevels || [];
        setLanguages((prev) =>
          prev.map((lang) => ({
            ...lang,
            progress:
              lang.title === "German"
                ? Math.min(Math.round((completed.length / 30) * 100), 100)
                : 0,
          }))
        );
        setStats({ xp: data.xp || 2450, levels: completed.length || 18, streak: storedUser?.streak || 7 });
      })
      .catch(() => {});
  }, []);

  const avatarSrc = useMemo(() => {
    const a = user?.avatar;
    return a || "/dogs/dog1.png"; // fallback mascot in public/dogs/
  }, [user]);

  if (!user) return null;

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.BLACK, color: COLORS.WHITE, minHeight: "100vh" }}>
      <TopBar navOpen={navOpen} />
      <SideNavbar onOpenChange={setNavOpen} />

      {/* Main 3-panel layout */}
      <div className={`${styles.container}`} style={{ position: 'relative', overflow: 'hidden', '--dur-base': '420ms', '--easing-soft': 'var(--easing-deluxe)', maxWidth: 1320, paddingTop: 80, marginLeft: navOpen ? 280 : 0, transition: "margin-left var(--dur-base) var(--easing-soft)" }}>
        {/* Soft drifting radial background */}
        <div aria-hidden className="bg-drift-medium bg-pulse" style={{ position: 'absolute', inset: '-10%', background: 'radial-gradient(40% 30% at 60% 0%, rgba(0,0,0,0.05), transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />
        <div className="grid gap-6 motion-fade-in" style={{ gridTemplateColumns: navOpen ? "1fr 0" : "3fr 1fr" }}>
          {/* Middle (primary) */}
          <main className="space-y-6">
            {/* Welcome row */}
            <div className="flex items-center gap-4 rounded-xl p-5 motion-fade-up hover-lift hover-glow" style={{ backgroundColor: COLORS.DARK_BLUE, border: "1px solid var(--color-border)" }}>
              <img src={avatarSrc} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
              <div className="flex-1">
                <div className="text-sm" style={{ color: COLORS.MUTED }}>Welcome</div>
                <div className="text-2xl font-black" style={{ color: COLORS.WHITE }}>{user?.name}</div>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-sm" style={{ color: COLORS.MUTED }}>
                <span>XP: <b style={{ color: COLORS.RED }}>{stats.xp}</b></span>
                <span>Levels: <b style={{ color: COLORS.RED }}>{stats.levels}</b></span>
                <span>Streak: <b style={{ color: COLORS.RED }}>{stats.streak}</b></span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="motion-fade-up delay-1">
              <QuickActions onNavigate={navigate} />
            </div>

            {/* Language progress bars (always show, animate width) */}
            <div className="space-y-3 motion-fade-up delay-2">
              {languages.map((l) => (
                <button
                  key={l.title}
                  onClick={() => navigate(getLanguageRoute(l.title))}
                  className="w-full text-left rounded-lg p-4 hover-lift hover-glow"
                  style={{ backgroundColor: COLORS.DARK_BLUE, border: "1px solid var(--color-border)" }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <img src={l.flag} alt={l.title} className="w-6 h-4 rounded object-cover" />
                    <span className="font-semibold" style={{ color: COLORS.WHITE }}>{l.title}</span>
                    <span className="ml-auto text-xs" style={{ color: l.progress ? COLORS.MUTED : COLORS.MUTED }}>{(l.progress || 0)}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-bg-subtle)" }}>
                    <div className="h-full" style={{ width: `${l.progress || 0}%`, backgroundColor: COLORS.RED, transition: "width var(--dur-base) var(--easing-soft)" }} />
                  </div>
                  {!l.progress && (
                    <div className="mt-2 text-xs" style={{ color: COLORS.MUTED }}>No progress yet — start learning</div>
                  )}
                </button>
              ))}
            </div>

            {/* Language cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 motion-fade-up delay-3">
              {languages.map((lang) => (
                <LanguageCard
                  key={lang.title}
                  title={lang.title}
                  flag={lang.flag}
                  difficulty={lang.difficulty}
                  progress={lang.progress || 0}
                  onClick={() => navigate(getLanguageRoute(lang.title))}
                  surfaceColor="#ffffff"
                  textColor="#0a0a0a"
                />
              ))}
            </div>

            {/* Recommended row */}
            <div className="motion-fade-up delay-4">
              <RecommendedRow onNavigate={navigate} />
            </div>
          </main>

          {/* Right (secondary) - hidden when nav opens */}
          <aside className={`${navOpen ? "hidden" : "block"} space-y-6 motion-fade-up delay-2`} style={{ position: "sticky", top: 88 }}>
            <PremiumCardCompact />
            <ChatbotPlaceholder />
          </aside>
        </div>
      </div>
    </div>
  );
}

function PremiumCardCompact() {
  return (
    <div className="p-6 rounded-xl hover-lift hover-glow" style={{ backgroundColor: COLORS.DARK_BLUE, border: "1px solid rgba(0,0,0,0.08)" }}>
      <div className="text-xs font-black mb-2" style={{ color: COLORS.RED }}>PREMIUM</div>
      <div className="text-xl font-black mb-2" style={{ color: COLORS.WHITE }}>Upgrade to Pro</div>
      <div className="text-sm mb-4" style={{ color: COLORS.MUTED }}>Unlock AI insights, custom paths, and priority support.</div>
      <button className="btn-base btn-accent btn-sheen" style={{ width: "100%" }}>Subscribe</button>
    </div>
  );
}
function QuickActions({ onNavigate }) {
  const actions = [
    { label: "Continue German", icon: FaPlay, onClick: () => onNavigate("/learn/german") },
    { label: "Review Mistakes", icon: FaRedo, onClick: () => onNavigate("/learn") },
    { label: "Placement Test", icon: FaChartLine, onClick: () => onNavigate("/learn") },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {actions.map((a) => (
        <button
          key={a.label}
          onClick={a.onClick}
          className="btn-base btn-ghost w-full flex items-center justify-center gap-2 hover-lift hover-glow"
          style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 12, padding: "12px 14px" }}
        >
          <a.icon size={14} />
          <span>{a.label}</span>
        </button>
      ))}
    </div>
  );
}

function RecommendedRow({ onNavigate }) {
  const items = [
    { title: "Test your German level", cta: "Start", onClick: () => onNavigate("/learn/german") },
    { title: "Start Spanish basics", cta: "Go", onClick: () => onNavigate("/learn/spanish") },
    { title: "View Leaderboard", cta: "Open", onClick: () => onNavigate("/leaderboard") },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map((it) => (
        <div
          key={it.title}
          className="p-5 rounded-xl"
          style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "#fff" }}
        >
          <div className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>Recommended</div>
          <div className="mt-1 font-black" style={{ color: "#fff" }}>{it.title}</div>
          <div className="mt-3">
            <button className="btn-base btn-accent" onClick={it.onClick}>{it.cta}</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Languages moved into main layout using LanguageCard

function ProgressSection({ stats }) {
  const items = [
    { label: "Total XP", value: stats.xp },
    { label: "Levels", value: stats.levels },
    { label: "Streak", value: `${stats.streak} days` },
  ];
  return (
    <section className="py-24 px-6 border-t" style={{ backgroundColor: COLORS.BLACK, borderColor: COLORS.DARK_BLUE }}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-4" style={{ color: COLORS.WHITE }}>
          Your Progress
        </h2>
        <div className="w-16 h-1 rounded-full mb-10" style={{ backgroundColor: COLORS.RED }} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((it) => (
            <div key={it.label} className="p-8 rounded-xl border-2" style={{ backgroundColor: COLORS.BLACK, borderColor: COLORS.DARK_BLUE }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: COLORS.MUTED }}>{it.label}</p>
              <p className="text-4xl md:text-5xl font-black" style={{ color: COLORS.RED }}>{it.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SubscriptionSection() {
  return (
    <section className="py-24 px-6 border-t" style={{ backgroundColor: COLORS.BLACK, borderColor: COLORS.DARK_BLUE }}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-4" style={{ color: COLORS.WHITE }}>
          Upgrade to Pro
        </h2>
        <div className="w-16 h-1 rounded-full mb-10" style={{ backgroundColor: COLORS.RED }} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-8 rounded-xl border-2" style={{ backgroundColor: COLORS.BLACK, borderColor: COLORS.DARK_BLUE }}>
            <h3 className="text-3xl font-black mb-6" style={{ color: COLORS.WHITE }}>Free</h3>
            <ul className="space-y-3 mb-8">
              {["Core learning features", "Progress tracking", "Multiple languages", "Community support"].map((f) => (
                <li key={f} className="flex gap-3 items-center"><span style={{ color: COLORS.RED }}>✓</span><span style={{ color: COLORS.WHITE }}>{f}</span></li>
              ))}
            </ul>
            <button className="w-full py-4 font-bold rounded border-2" style={{ color: COLORS.WHITE, borderColor: COLORS.DARK_BLUE, backgroundColor: "transparent" }}>Your Current Plan</button>
          </div>
          <div className="p-8 rounded-xl border-2 relative" style={{ backgroundColor: COLORS.BLACK, borderColor: COLORS.RED }}>
            <div className="absolute -top-4 left-6 px-4 py-1 rounded-full text-xs font-black" style={{ backgroundColor: COLORS.RED, color: COLORS.WHITE }}>PREMIUM</div>
            <h3 className="text-3xl font-black mb-6 mt-4" style={{ color: COLORS.RED }}>Pro</h3>
            <ul className="space-y-3 mb-8">
              {["Advanced AI analysis", "Detailed insights", "Priority support", "Custom learning paths"].map((f) => (
                <li key={f} className="flex gap-3 items-center"><span style={{ color: COLORS.RED }}>✓</span><span style={{ color: COLORS.WHITE }}>{f}</span></li>
              ))}
            </ul>
            <button className="w-full py-4 font-black rounded text-lg" style={{ backgroundColor: COLORS.RED, color: COLORS.WHITE }}>Upgrade to Pro</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer removed per new compact home design

function getLanguageRoute(name) {
  const key = name.toLowerCase();
  switch (key) {
    case "german":
      return "/learn/german";
    case "spanish":
      return "/learn/spanish";
    // Add more when available
    default:
      return "/learn";
  }
}
