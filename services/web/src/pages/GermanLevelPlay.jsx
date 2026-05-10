import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import DragDropGame from "../components/games/DragDropGame";
import ListeningGame from "../components/games/ListeningGame";
import MCQGame from "../components/games/MCQGame";
import SentenceBuilderGame from "../components/games/SentenceBuilderGame";
import WordMatchGame from "../components/games/WordMatchGame";
import BossLevel from "./BossLevel";
// TopBar removed for this page; we'll use a small clickable label instead
import ArcadeCabinet from "../components/ArcadeCabinet";
import LevelPlayTopBar from "../components/LevelPlayTopBar";
import SideNavbar from "../components/SideNavbar";
import styles from "./LandingNew.module.css";

/* ---------------- CONFIG ---------------- */

const BOSS_LEVELS = [11, 22];

/* ---------------- COMPONENT ---------------- */

export default function GermanLevelPlay() {
  const { level } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { syncUser } = useAuth();
  const [navOpen, setNavOpen] = useState(false);

  const lvl = Number(level);
  const isBoss = BOSS_LEVELS.includes(lvl);
  const isPractice = searchParams.get("mode") === "practice";

  const [data, setData] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ---------------- FETCH NORMAL LEVEL DATA ---------------- */
  useEffect(() => {
    setData(null);
    setCompleted(false);

    if (isBoss) return;

    fetch(`http://localhost:8000/api/learn/german/level/${lvl}`)
      .then(res => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then(setData)
      .catch(err =>
        console.error("Level fetch error:", err)
      );
  }, [lvl, isBoss]);

  /* ---------------- SAVE LEVEL (BLOCKED IN PRACTICE MODE) ---------------- */
  async function saveNormalLevel() {
    if (saving) return;

    // Practice mode → no XP / paws
    if (isPractice) {
      // Directly move to next level in practice mode
      const next = `/learn/german/level/${lvl + 1}`;
      navigate(next, { replace: true });
      return;
    }

    setSaving(true);
    setCompleted(true);

    try {
      const res = await fetch("http://localhost:5000/api/progress/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(
            "lingorush_token"
          )}`,
        },
        body: JSON.stringify({
          language: "german",
          level: lvl,
          xpGain: 50,
          pawsGain: 1,
        }),
      });
      if (res.ok) {
        // Sync user stats (streak, level, activity) before moving on
        await syncUser();
        navigate(`/learn/german/level/${lvl + 1}` , { replace: true });
      }
    } catch (err) {
      console.error("Progress save failed:", err);
    } finally {
      setSaving(false);
    }
  }

  /* ---------------- GAME SELECTOR ---------------- */
  function renderGame() {
    const gameIndex = (lvl - 1) % 5;

    const commonProps = {
      difficulty: data.difficulty,
      onResult: passed => passed && saveNormalLevel(),
    };

    switch (gameIndex) {
      case 0:
        return (
          <WordMatchGame
            content={data.pairs}
            {...commonProps}
          />
        );

      case 1:
        return (
          <ListeningGame
            content={data.pairs}
            {...commonProps}
          />
        );

      case 2:
        return (
          <MCQGame
            content={data.pairs}
            {...commonProps}
          />
        );

      case 3:
        return (
          <DragDropGame
            level={lvl}
            {...commonProps}
          />
        );

      case 4:
        return (
          <SentenceBuilderGame
            level={lvl}
            {...commonProps}
          />
        );

      default:
        return null;
    }
  }

  /* ---------------- LOADING ---------------- */
  if (!isBoss && !data) {
    return (
      <div className={`${styles.page} motion-fade-in`} style={{ backgroundColor: "transparent", minHeight: '100vh' }}>
        <LevelPlayTopBar />
        <SideNavbar onOpenChange={setNavOpen} />
        <main className={`${styles.container} motion-fade-up`} style={{ paddingTop: 24 }}>
          <ArcadeCabinet>
            <div aria-hidden className="bg-drift-medium bg-pulse" style={{ position: 'absolute', inset: '-10%', background: 'radial-gradient(40% 30% at 60% 0%, rgba(0,0,0,0.05), transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />
            <div className="max-w-3xl mx-auto">
              <div className="rounded-xl p-6" style={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--text)' }}>
                Loading level...
              </div>
            </div>
          </ArcadeCabinet>
        </main>
      </div>
    );
  }

  /* ---------------- RENDER ---------------- */
  return (
    <div className={`${styles.page} motion-fade-in`} style={{ backgroundColor: "transparent", minHeight: '100vh' }}>
      <LevelPlayTopBar />
      <SideNavbar onOpenChange={setNavOpen} />
      
      <main className={`${styles.container} motion-fade-up`} style={{ position: 'relative', overflow: 'hidden', paddingTop: 24 }}>
        <ArcadeCabinet>
        <div aria-hidden className="bg-drift-medium bg-pulse" style={{ position: 'absolute', inset: '-10%', background: 'radial-gradient(40% 30% at 60% 0%, rgba(0,0,0,0.05), transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />

        <div className="max-w-3xl mx-auto space-y-6">
          {/* Back link moved to CRT overlay top; removed duplicate here */}

          {/* Header card (white) with arcade-style hover on inner content */}
          <div className="arcade-blink">
            <div className="rounded-xl p-6 hover-lift hover-glow" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)' }}>
            <div className="text-xs font-black" style={{ color: 'var(--accent)' }}>LEVEL</div>
            <h1 className="text-2xl font-black" style={{ color: '#0a0a0a' }}>Level {isBoss ? lvl : data.level}</h1>
            {!isBoss && (
              <p className="text-sm" style={{ color: 'rgba(10,10,10,0.65)' }}>Difficulty: {data.difficulty}</p>
            )}
            {isPractice && (
              <p className="text-sm" style={{ color: 'var(--accent)' }}>🔁 Practice Mode — progress will not be saved</p>
            )}
            </div>
          </div>

          {/* Game card */}
          <div className="rounded-xl p-6 motion-scale-in overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--text)' }}>
            <div className="arcade-game">
            {isBoss ? (
              <BossLevel
                onFinish={results => {
                  const score = results.filter(Boolean).length * 20;
                  // Practice mode: don't save boss progress
                  if (isPractice) {
                    navigate(`/learn/german/level/${lvl + 1}`, { replace: true });
                    return;
                  }
                  fetch('http://localhost:5000/api/progress/boss', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${localStorage.getItem('lingorush_token')}`,
                    },
                    body: JSON.stringify({ language: 'german', level: lvl, score, unlockNext: true }),
                  })
                    .then(res => {
                      if (res.ok) {
                        navigate(`/learn/german/level/${lvl + 1}`, { replace: true });
                      }
                    })
                    .catch(() => {
                      // On error, still move on to avoid blocking the user
                      navigate(`/learn/german/level/${lvl + 1}`, { replace: true });
                    });
                }}
              />
            ) : (
              renderGame()
            )}
            </div>
          </div>

          {/* Completion actions */}
          {/* No inline completion UI; transitions handled by LevelCompleteScreen */}
        </div>
          </ArcadeCabinet>
        </main>
    </div>
  );
}
