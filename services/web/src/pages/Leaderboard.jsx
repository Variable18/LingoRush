import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCrown, FaBolt, FaFire, FaArrowUp, FaArrowDown, FaMinus } from "react-icons/fa";
import SideNavbar from "../components/SideNavbar";
import TopBar from "../components/TopBar";
import { useAuth } from "../context/AuthContext";
import { fetchLeaderboard } from "../services/api";
import styles from "./LandingNew.module.css";

// Colors from Home.jsx
const COLORS = {
  PAGE_BG: "transparent",
  CARD_BG: "var(--color-bg-card)",
  TEXT_MAIN: "var(--color-text-main)",
  TEXT_MUTED: "var(--color-text-muted)",
  ACCENT: "var(--accent)",
  GOLD: "#ebb502",
};

const Avatar = ({ name, size = "md", className = "" }) => {
  const initials = name ? name.substring(0, 2).toUpperCase() : "?";
  // Light, playful colors for avatars
  const colors = ["bg-sky-400", "bg-purple-400", "bg-emerald-400", "bg-amber-400", "bg-rose-400", "bg-indigo-400"];
  const colorIndex = name ? name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length : 0;
  
  const sizeClasses = {
    sm: "w-10 h-10 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-20 h-20 text-2xl",
    xl: "w-24 h-24 text-3xl",
    full: "w-full h-full text-3xl"
  };

  return (
    <div className={`rounded-full ${colors[colorIndex]} ${sizeClasses[size]} flex items-center justify-center font-bold text-white shadow-sm border-2 border-white ${className}`}>
      {initials}
    </div>
  );
};

export default function Leaderboard() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  // Poll for simulated "live" changes to rank movement
  const fetchUsers = async () => {
    const generateMock = () => Array.from({length: 15}, (_, i) => ({
        rank: i + 1,
        id: `mock-${i}`,
        name: i%2===0 ? `Learner ${i+1}` : `User ${i+1}`,
        xp: 12000 - (i * 450),
        streak: Math.floor(Math.random() * 20),
        movement: i < 5 ? "same" : (i % 3 === 0 ? "up" : i % 2 === 0 ? "down" : "same")
    }));

    try {
        const token = localStorage.getItem("lingorush_token");
        const data = await fetchLeaderboard(token);
        
        let result = data;
        // Use mock if API returns empty array (fresh DB)
        if (!data || !Array.isArray(data) || data.length === 0) {
             console.log("Empty leaderboard, using mock data");
             result = generateMock();
        }

        const enhancedData = result.map(u => ({
             ...u,
             movement: u.movement || (Math.random() > 0.7 ? (Math.random() > 0.5 ? "up" : "down") : "same"),
             streak: u.streak !== undefined ? u.streak : Math.floor(Math.random() * 500) // Mock streak
        }));
        setUsers(enhancedData);
    } catch (error) {
        console.error("Failed to load leaderboard", error);
        // Fallback demo data
        if (users.length === 0) {
             setUsers(generateMock());
        }
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 15000); 
    return () => clearInterval(interval);
  }, []);

  const rank1 = users.find(u => u.rank === 1);
  const rank2 = users.find(u => u.rank === 2);
  const rank3 = users.find(u => u.rank === 3);
  const listUsers = users.filter(u => u.rank > 3);

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.PAGE_BG, color: COLORS.TEXT_MAIN, minHeight: "100vh" }}>
      <TopBar navOpen={navOpen} />
      <SideNavbar onOpenChange={setNavOpen} />
      
      <main className="transition-all duration-300 ease-[var(--easing-deluxe)] pt-20 pb-20" style={{ marginLeft: navOpen ? 280 : 0 }}>
        
        {/* HERO SECTION */}
        <div className="w-full bg-gradient-to-b from-[#e0f7ef] to-[#f5f5f0] pt-12 pb-16 px-4 mb-8 border-b border-black/5">
             <div className="max-w-4xl mx-auto text-center">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-white/60 rounded-full text-xs font-bold text-accent uppercase tracking-widest mb-4 border border-white"
                >
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    Live Standings
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight" style={{ color: COLORS.TEXT_MAIN }}>Leaderboard</h1>
                <p className="text-lg" style={{ color: COLORS.TEXT_MUTED }}>Rank up, keep your streak alive, and learn!</p>
             </div>
        </div>

        <div className="max-w-4xl mx-auto px-4">
          {loading ? (
             <div className="text-center py-24 text-gray-400 animate-pulse">Updating scores...</div>
          ) : (
            <>
              {/* PODIUM */}
              <div className="flex flex-col md:flex-row items-end justify-center gap-6 mb-12 relative">
                 {/* Decorative background glow behind podium */}
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-accent/20 blur-[100px] rounded-full pointer-events-none" />

                 {/* 2nd Place */}
                 {rank2 && <PodiumAvatar user={rank2} rank={2} color="bg-emerald-400" delay={0.2} onClick={() => handleUserClick(rank2.id)} />}
                 
                 {/* 1st Place (Center) */}
                 {rank1 && <PodiumAvatar user={rank1} rank={1} color="bg-amber-400" delay={0.1} isCenter onClick={() => handleUserClick(rank1.id)} />}
                 
                 {/* 3rd Place */}
                 {rank3 && <PodiumAvatar user={rank3} rank={3} color="bg-rose-400" delay={0.3} onClick={() => handleUserClick(rank3.id)} />}
              </div>

              {/* LIST */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col gap-3"
              >
                {/* Header Row */}
                <div className="flex px-6 py-2 text-xs font-bold uppercase tracking-wider opacity-50">
                    <div className="w-12 md:w-16 text-center">Rank</div>
                    <div className="flex-1 pl-4">User</div>
                    <div className="text-right pr-4">XP</div>
                </div>

                {/* Rows */}
                {listUsers.map((user) => (
                    <LeaderboardRow 
                        key={user.id} 
                        user={user} 
                        isCurrentUser={currentUser && (currentUser.id === user.id || currentUser._id === user.id)}
                        onClick={() => handleUserClick(user.id)}
                    />
                ))}
              </motion.div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

const PodiumAvatar = ({ user, rank, color, delay, isCenter, onClick }) => {
    // 1st place is naturally larger
    const size = isCenter ? "w-32 h-32 md:w-40 md:h-40" : "w-24 h-24 md:w-28 md:h-28";
    const textSize = isCenter ? "text-xl" : "text-base";
    const heightOffset = isCenter ? "mb-8 md:mb-12" : "mb-0"; // Lift 1st place up
    
    return (
        <motion.div 
            onClick={onClick}
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay, type: "spring", bounce: 0.4 }}
            className={`flex flex-col items-center z-10 ${heightOffset} relative group cursor-pointer`}
        >
            {/* Rank Badge */}
            <div className={`absolute -top-3 z-20 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center font-bold text-white shadow-sm ${rank === 1 ? COLORS.GOLD : "bg-gray-800"}`} style={{ backgroundColor: rank === 1 ? COLORS.GOLD : undefined }}>
                {rank}
            </div>
            
            {/* Crown for #1 */}
            {isCenter && (
                <motion.div 
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, repeatDelay: 3, duration: 1 }}
                    className="absolute -top-12 text-5xl text-amber-400 drop-shadow-sm z-0"
                >
                    <FaCrown />
                </motion.div>
            )}

            {/* Avatar Circle */}
            <div className={`${size} rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 relative group-hover:scale-105 transition-transform duration-300 ease-[var(--easing-deluxe)]`}>
                <Avatar name={user.name} size="full" className="w-full h-full rounded-none !border-0" />
            </div>

            {/* Info */}
            <div className="mt-3 text-center transition-colors group-hover:text-accent">
                <div className={`font-bold ${textSize} text-gray-800 truncate max-w-[120px]`}>{user.name}</div>
                <div className="text-accent font-bold text-sm tracking-wide">{user.xp.toLocaleString()} XP</div>
            </div>
        </motion.div>
    )
}

const LeaderboardRow = ({ user, isCurrentUser, onClick }) => {
    let movementIcon = <FaMinus className="text-gray-300 text-[10px]" />;
    if (user.movement === "up") movementIcon = <FaArrowUp className="text-green-500 text-xs" />;
    if (user.movement === "down") movementIcon = <FaArrowDown className="text-red-400 text-xs" />;

    return (
        <div 
            onClick={onClick}
            className={`
                flex items-center justify-between px-4 py-3 md:px-6 md:py-4 rounded-2xl
                transition-all duration-200 border cursor-pointer
                ${isCurrentUser 
                    ? "bg-white border-accent shadow-md md:scale-[1.02] z-10 ring-1 ring-accent/20" 
                    : "bg-white border-transparent hover:border-gray-200 hover:shadow-sm hover:translate-x-1"
                }
            `}
        >
            {/* Rank Column - Fixed Width */}
            <div className="w-12 md:w-16 flex flex-col items-center justify-center flex-shrink-0">
                <span className="font-bold text-gray-500 text-lg">#{user.rank}</span>
                <div className="mt-1">{movementIcon}</div>
            </div>

            {/* User Column - Grows */}
            <div className="flex-1 flex items-center gap-3 md:gap-4 pl-2 min-w-0">
                <Avatar name={user.name} size="sm" className="flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                    <span className={`font-bold truncate ${isCurrentUser ? "text-accent" : "text-gray-800 group-hover:text-amber-600"}`}>
                        {user.name} {isCurrentUser && "(You)"}
                    </span>
                    <div className="flex items-center gap-1 md:hidden">
                        <FaBolt className="text-amber-400 text-[10px]" /> 
                        <span className="text-xs text-gray-400">{user.xp} XP</span>
                    </div>
                </div>
            </div>

            {/* Stats Column - Auto width aligned right */}
            <div className="flex items-center justify-end gap-3 md:gap-6 text-right flex-shrink-0 pl-2">
                {/* Streak (Desktop only) */}
                <div className="hidden md:flex items-center gap-1.5 text-gray-400" title="Current Streak">
                    <FaFire className={user.streak > 0 ? "text-orange-500" : "text-gray-300"} />
                    <span className="font-bold text-sm">{user.streak}</span>
                </div>
                
                {/* XP Pill */}
                <div className="bg-gray-50 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-gray-100 min-w-[100px] justify-center">
                    <FaBolt className="text-amber-400" />
                    <span className="font-bold text-gray-700">{user.xp.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};
