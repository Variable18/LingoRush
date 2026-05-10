import { useState } from "react";
import SideNavbar from "../components/SideNavbar";
import TopBar from "../components/TopBar";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { 
  FaMoon, 
  FaBell, 
  FaGraduationCap, 
  FaUserCog, 
  FaExclamationTriangle,
  FaClock
} from "react-icons/fa";

// Reusable core components for consistent style
const SectionCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-6 transition-all duration-300 hover:shadow-md animate-fade-in-up">
    <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">
        <Icon size={18} />
      </div>
      <h2 className="text-lg font-black text-gray-900 tracking-tight">{title}</h2>
    </div>
    <div className="space-y-6">
      {children}
    </div>
  </div>
);

const ToggleRow = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between">
    <div>
      <div className="font-bold text-gray-900 text-sm">{label}</div>
      {description && <div className="text-xs text-gray-400 font-bold mt-1 max-w-[200px]">{description}</div>}
    </div>
    <button 
      onClick={() => onChange(!checked)}
      className={`w-12 h-7 rounded-full transition-colors relative ${checked ? 'bg-[#00E676]' : 'bg-gray-200'}`}
    >
      <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  </div>
);

const RadioGroup = ({ options, value, onChange }) => (
  <div className="flex bg-gray-50 p-1 rounded-xl">
    {options.map((opt) => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
          value === opt 
            ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-100' 
            : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

export default function Settings() {
  const { logout } = useAuth();
  const [navOpen, setNavOpen] = useState(false);
  
  // 1. Learning Preferences
  const [dailyGoal, setDailyGoal] = useState("15 min");
  const [difficulty, setDifficulty] = useState("Adaptive");

  // 2. Notifications
  const [dailyReminder, setDailyReminder] = useState(true);
  const [streakReminder, setStreakReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState("09:00");

  // 3. Appearance
  const { theme, toggleTheme } = useTheme();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [textSize, setTextSize] = useState("Default");

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all your learning progress? This cannot be undone.")) {
      alert("This is just a demo. Progress was not reset.");
    }
  };

  return (
    <div className="min-h-screen bg-transparent font-sans pb-20">
      <SideNavbar onOpenChange={setNavOpen} />
      <TopBar navOpen={navOpen} />

      <div 
        className="transition-all duration-300 ease-out min-h-screen"
        style={{ marginLeft: navOpen ? 280 : 0 }}
      >
        <main className="pt-28 px-6 pb-12 mx-auto max-w-2xl">
            <div className="mb-10 text-center animate-fade-in-up">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Settings</h1>
                <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">Control your experience</p>
            </div>

            {/* 1. LEARNING PREFERENCES */}
            <SectionCard title="Learning Preferences" icon={FaGraduationCap}>
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Daily Goal</label>
                    <RadioGroup 
                        options={["10 min", "15 min", "30 min"]} 
                        value={dailyGoal} 
                        onChange={setDailyGoal} 
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Difficulty Level</label>
                    <div className="grid grid-cols-3 gap-3">
                        {["Adaptive", "Easy", "Challenging"].map(level => (
                            <button 
                                key={level}
                                onClick={() => setDifficulty(level)}
                                className={`py-3 px-4 rounded-xl border-2 text-left transition-all ${
                                    difficulty === level 
                                    ? 'border-[#00E676] bg-[#00E676]/5 ring-1 ring-[#00E676]' 
                                    : 'border-gray-100 hover:border-gray-200 bg-white'
                                }`}
                            >
                                <div className={`text-sm font-black ${difficulty === level ? 'text-gray-900' : 'text-gray-500'}`}>{level}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </SectionCard>

            {/* 2. NOTIFICATIONS */}
            <SectionCard title="Notifications" icon={FaBell}>
                <ToggleRow 
                    label="Daily Learning Reminder" 
                    description="Get a notification to practice every day" 
                    checked={dailyReminder} 
                    onChange={setDailyReminder} 
                />

                {dailyReminder && (
                    <div className="flex items-center justify-between pl-4 border-l-2 border-gray-100 py-2 animate-fade-in-up">
                        <span className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                            <FaClock size={14} className="text-gray-400" /> Time
                        </span>
                        <input 
                            type="time" 
                            value={reminderTime} 
                            onChange={(e) => setReminderTime(e.target.value)}
                            className="bg-gray-50 border-none rounded-lg text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#00E676] outline-none py-1.5 px-3"
                        />
                    </div>
                )}

                <ToggleRow 
                    label="Streak Safeguard" 
                    description="Alert before you lose your streak" 
                    checked={streakReminder} 
                    onChange={setStreakReminder} 
                />
            </SectionCard>

            {/* 3. APPEARANCE */}
            <SectionCard title="Appearance" icon={FaMoon}>
                <ToggleRow 
                    label="Dark Mode" 
                    description="Easier on the eyes" 
                    checked={theme === 'dark'} 
                    onChange={toggleTheme} 
                />

                <ToggleRow 
                    label="Reduce Animations" 
                    description="Minimize motion effects" 
                    checked={reduceMotion} 
                    onChange={setReduceMotion} 
                />

                <div className="pt-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Text Size</label>
                    <RadioGroup 
                        options={["Small", "Default", "Large"]} 
                        value={textSize} 
                        onChange={setTextSize} 
                    />
                </div>
            </SectionCard>

            {/* 4. ACCOUNT */}
            <SectionCard title="Account" icon={FaUserCog}>
                <div className="flex flex-col gap-4">
                    <button 
                        onClick={logout}
                        className="w-full py-3.5 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all text-sm"
                    >
                        Log Out
                    </button>

                    <button 
                        onClick={handleReset}
                        className="w-full py-3.5 rounded-xl border border-red-100 text-red-500 font-bold hover:bg-red-50 transition-all text-sm flex items-center justify-center gap-2"
                    >
                        <FaExclamationTriangle size={14} />
                        Reset Progress
                    </button>
                </div>
            </SectionCard>

            <div className="text-center text-xs text-gray-300 font-bold uppercase tracking-widest mt-12 mb-6">
                LingoRush v1.0.4
            </div>
        </main>
      </div>
    </div>
  );
}
