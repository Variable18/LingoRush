import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaHome,
  FaGraduationCap,
  FaTrophy,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const menuItems = [
  { icon: FaHome, label: "Home", path: "/home" },
  { icon: FaGraduationCap, label: "Learn", path: "/learn" },
  { icon: FaTrophy, label: "Leaderboard", path: "/leaderboard" },
  { icon: FaUser, label: "Profile", path: "/profile" },
  { icon: FaCog, label: "Settings", path: "/settings" },
  { icon: FaSignOutAlt, label: "Logout", path: "/logout", isLogout: true },
];

export default function SideNavbar({ onOpenChange }) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleNavigate = useCallback((path, isLogout) => {
    if (isLogout) {
      localStorage.removeItem("lingorush_token");
      localStorage.removeItem("lingorush_user");
      navigate("/login");
      return;
    }
    navigate(path);
  }, [navigate]);

  const setOpenAndNotify = (v) => {
    setOpen(v);
    onOpenChange && onOpenChange(v);
  };

  return (
    <>
      {/* Hover zone ~2mm with pixel fallback */}
      <div
        className="fixed top-0 left-0 h-full z-40"
        style={{ width: "max(2mm, 12px)" }}
        onMouseEnter={() => setOpenAndNotify(true)}
      />

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-out`}
        style={{
          transform: open ? "translateX(0)" : "translateX(-100%)",
          width: 280,
          background: "#18181b",
          borderRight: "2px solid var(--accent)",
        }}
        onMouseLeave={() => setOpenAndNotify(false)}
      >
        {/* Header */}
        <div
          className="flex items-end justify-between p-5"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,0,85,0.2), rgba(255,255,255,0.05))",
            borderBottom: "1px solid var(--accent)",
          }}
        >
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--accent)] bg-white">
                <img src={user?.avatar || "/cats/cat1.png"} alt="User" className="w-full h-full object-cover" />
             </div>
             <div>
                <h2 className="text-lg font-black" style={{ color: "var(--accent)" }}>{user?.name || "LingoRush"}</h2>
                <p className="text-xs" style={{ color: "var(--muted)" }}>Level {user?.level || 1}</p>
             </div>
          </div>
          <button
            onClick={() => setOpenAndNotify(false)}
            className="px-3 py-2 rounded"
            style={{ color: "var(--accent)" }}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Menu items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigate(item.path, item.isLogout)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg"
              style={{
                color: "#000",
                background: "#fff",
                border: "1px solid var(--surface)",
              }}
            >
              <item.icon size={18} />
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-4 left-4 right-4 text-xs" style={{ color: "var(--muted)" }}>
          <p>v1.0.0</p>
          <p>© 2026 LingoRush</p>
        </div>
      </aside>
    </>
  );
}
