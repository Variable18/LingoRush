import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import {
  FaHome,
  FaGraduationCap,
  FaTrophy,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { icon: FaHome, label: "Home", path: "/" },
  { icon: FaGraduationCap, label: "Learn", path: "/learn" },
  { icon: FaTrophy, label: "Leaderboard", path: "/leaderboard" },
  { icon: FaUser, label: "Profile", path: "/profile" },
  { icon: FaCog, label: "Settings", path: "/settings" },
  { icon: FaSignOutAlt, label: "Logout", path: "/logout", isLogout: true },
];

export default function MenuSlider() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path, isLogout) => {
    if (isLogout) {
      localStorage.removeItem("lingorush_token");
      localStorage.removeItem("lingorush_user");
    }
    navigate(path);
    setIsOpen(false);
  };

  // animations removed

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 left-6 z-40 bg-[rgb(var(--color-card-inverse))] text-white p-3 rounded-xl shadow-lg"
      >
        <GiHamburgerMenu size={24} />
      </button>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          />

          {/* Menu Slider */}
          <div
            className="fixed left-0 top-0 bottom-0 w-80 bg-gradient-to-br from-gray-900 via-black to-gray-900 z-40 shadow-2xl overflow-y-auto"
          >
              {/* Header */}
              <div className="relative h-32 bg-gradient-to-br from-blue-600 to-purple-600 flex items-end p-6">
                <div className="flex justify-between items-end w-full">
                  <div>
                    <h2 className="text-white text-2xl font-black">LingoRush</h2>
                    <p className="text-white/80 text-sm">Learn Languages</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white p-2 rounded-lg"
                  >
                    <AiOutlineClose size={24} />
                  </button>
                </div>
              </div>

              {/* Menu Items */}
              <nav className="p-6 space-y-3">
                {menuItems.map((item, i) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavigate(item.path, item.isLogout)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg ${
                      item.isLogout
                        ? "text-red-400 mt-6 border-t border-gray-700 pt-6"
                        : "text-white"
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-semibold">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Footer */}
              <div className="absolute bottom-6 left-6 right-6 text-white/50 text-xs">
                <p>v1.0.0</p>
                <p>© 2025 LingoRush</p>
              </div>
          </div>
        </>
      )}
    </>
  );
}
