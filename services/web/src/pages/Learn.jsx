import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBook, FaLanguage, FaLayerGroup, FaPlay, FaCheck, FaLock, FaChevronRight } from "react-icons/fa";
import SideNavbar from "../components/SideNavbar";
import TopBar from "../components/TopBar";
import styles from "./LandingNew.module.css";

// Minimal palette based on Home.jsx
const COLORS = {
  PAGE_BG: "transparent",
  TEXT_MAIN: "var(--color-text-main)",
  TEXT_MUTED: "var(--color-text-muted)",
  ACCENT: "var(--accent)",
  WHITE: "var(--color-bg-card)",
  BORDER: "var(--color-border)"
};

// Simplified Syllabus Data
const SYLLABUS = [
  { id: 1, title: "Basics of German", unit: "Unit 1", status: "completed" },
  { id: 2, title: "Common Phrases", unit: "Unit 1", status: "completed" },
  { id: 3, title: "Food & Dining", unit: "Unit 2", status: "current", desc: "Ordering, Vegetables, Fruits", time: "20 min" },
  { id: 4, title: "Travel Essentials", unit: "Unit 2", status: "locked" },
  { id: 5, title: "Boss Review I", unit: "Milestone", status: "locked" },
  { id: 6, title: "Family & Friends", unit: "Unit 3", status: "locked" },
  { id: 7, title: "Numbers & Time", unit: "Unit 3", status: "locked" },
];

export default function Learn() {
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [currentLevelId, setCurrentLevelId] = useState(3); // Defaulting to 3 for demo based on mock
  
  // Animation variants - subtle fade up
  const fadeUp = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  const container = {
    visible: { transition: { staggerChildren: 0.05 } }
  };

  // Find active level
  const activeLevel = SYLLABUS.find(l => l.status === "current") || SYLLABUS[0];

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("lingorush_token");
        if (!token) return;
        const res = await fetch("http://localhost:5000/api/progress/german", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
           // Logic to sync real progress would go here
           // For now keeping UI pure as requested
        }
      } catch(e) { console.error(e); }
    }
    fetchProgress();
  }, []);

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.PAGE_BG, color: COLORS.TEXT_MAIN, minHeight: "100vh" }}>
      <TopBar navOpen={navOpen} />
      <SideNavbar onOpenChange={setNavOpen} />
      
      <div 
        className="transition-all duration-300"
        style={{ paddingLeft: navOpen ? 280 : 0 }}
      >
        <main className="pt-24 pb-20 px-6 max-w-4xl mx-auto">
            <motion.div 
                initial="hidden" 
            animate="visible" 
            variants={container}
            className="flex flex-col gap-10"
        >
            {/* 1. Page Header (Minimal) */}
            <motion.header variants={fadeUp}>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Learn</h1>
                <p className="text-base text-gray-500 mt-1 font-medium">Continue your language journey</p>
            </motion.header>

            {/* 2. Current Lesson (Single Compact Card) */}
            <motion.section variants={fadeUp}>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group hover:shadow-md transition-shadow duration-300">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold text-accent uppercase tracking-wider bg-accent/10 px-2 py-0.5 rounded-md">
                                In Progress
                            </span>
                            <span className="text-xs font-semibold text-gray-400">
                                {activeLevel.unit}
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">
                            {activeLevel.title}
                        </h2>
                        <p className="text-sm text-gray-500 font-medium">
                            {activeLevel.desc} • {activeLevel.time}
                        </p>
                        
                        {/* Tiny Progress Bar */}
                        <div className="w-full max-w-[200px] h-1.5 bg-gray-100 rounded-full mt-4 overflow-hidden">
                            <div className="h-full bg-accent w-1/3 rounded-full" />
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate("/german/levels")}
                        className="bg-accent text-white hover:opacity-90 transition-opacity px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2 shrink-0 w-full sm:w-auto justify-center"
                    >
                        <FaPlay size={12} />
                        Continue
                    </button>
                </div>
            </motion.section>

            {/* 3. Practice Tools (Small Utility Cards) */}
            <motion.section variants={fadeUp}>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Practice Tools</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <ToolCard 
                        icon={<FaBook />} 
                        title="Vocabulary" 
                        onClick={() => navigate("/german/levels")}
                        color="text-sky-600 bg-sky-50"
                    />
                    <ToolCard 
                        icon={<FaLanguage />} 
                        title="Grammar" 
                        onClick={() => navigate("/german/levels")}
                        color="text-purple-600 bg-purple-50"
                    />
                    <ToolCard 
                        icon={<FaLayerGroup />} 
                        title="Flashcards" 
                        onClick={() => navigate("/german/levels")}
                        color="text-amber-600 bg-amber-50"
                    />
                </div>
            </motion.section>

            {/* 4. Learning Path Overview (Clean & Minimal) */}
            <motion.section variants={fadeUp}>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Course Overview</h3>
                <div className="flex flex-col gap-3">
                    {SYLLABUS.map((level) => (
                        <SyllabusItem 
                            key={level.id} 
                            level={level} 
                            onClick={() => level.status !== "locked" && navigate("/german/levels")}
                        />
                    ))}
                </div>
            </motion.section>

          </motion.div>
        </main>
      </div>
    </div>
  );
}

// ---------------- SUBCOMPONENTS ---------------- //

function ToolCard({ icon, title, color, onClick }) {
    return (
        <div 
            onClick={onClick}
            className="bg-white p-4 rounded-xl border border-transparent shadow-sm hover:border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-3"
        >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${color}`}>
                {icon}
            </div>
            <span className="text-sm font-bold text-gray-700">{title}</span>
        </div>
    );
}

function SyllabusItem({ level, onClick }) {
    const isLocked = level.status === "locked";
    const isCompleted = level.status === "completed";
    const isCurrent = level.status === "current";

    return (
        <div 
            onClick={onClick}
            className={`
                flex items-center justify-between p-4 rounded-xl border
                ${isLocked ? "bg-transparent border-transparent opacity-50 cursor-not-allowed" : "bg-white border-transparent shadow-sm cursor-pointer hover:border-gray-200"}
                ${isCurrent ? "ring-1 ring-accent border-accent/20 bg-accent/5" : ""}
                transition-all
            `}
        >
            <div className="flex items-center gap-4">
                {/* Status Icon */}
                <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-[10px]
                    ${isCompleted ? "bg-green-100 text-green-600" : isLocked ? "bg-gray-100 text-gray-400" : "bg-accent text-white"}
                `}>
                    {isCompleted ? <FaCheck /> : isLocked ? <FaLock /> : <FaPlay className="ml-0.5" />}
                </div>

                <div>
                    <h4 className={`text-sm font-bold ${isLocked ? "text-gray-400" : "text-gray-900"}`}>
                        {level.title}
                    </h4>
                    {isCurrent && (
                        <span className="text-[10px] font-semibold text-accent uppercase tracking-wide">
                            Current Lvl
                        </span>
                    )}
                </div>
            </div>

            {!isLocked && (
                <FaChevronRight className="text-gray-300 text-xs" />
            )}
        </div>
    );
}
