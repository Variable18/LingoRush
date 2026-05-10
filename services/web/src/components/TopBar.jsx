
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FaFire, FaCrown } from "react-icons/fa";

export default function TopBar({ navOpen = false }) {
	const { user } = useAuth();
	const sidebarWidth = 280;
	const leftOffset = navOpen ? sidebarWidth : 0;
	
    // Real stats from user object
    const streak = user?.streak || 0;
    const level = user?.level || 1;

	return (
		<header
			style={{
				position: 'fixed', top: 0, left: leftOffset, right: 0, zIndex: 100,
				display: 'flex', justifyContent: 'space-between', alignItems: 'center',
				padding: '12px 24px',
				background: 'transparent',
				backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                pointerEvents: 'none' // Let clicks pass through empty space
			}}
		>
			<div className="w-8 pointer-events-auto"></div> {/* Spacer */}
			
            {/* Title - ensure it's clickable/interactive */}
            <Link to={user ? "/home" : "/"} className="display-title pointer-events-auto transition-colors duration-300" style={{ color: 'rgb(var(--color-text-main))', fontWeight: 800, letterSpacing: 'var(--tracking-title)', textDecoration: 'none' }}>LingoRush</Link>
			
            {user ? (
                /* Profile Section with Hover Card */
                <div className="relative group pointer-events-auto">
                    <Link to="/profile" className="block w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md ring-2 ring-gray-100 transition-transform hover:scale-105 active:scale-95 bg-white">
                        <img 
                            src={user?.avatar || "/cats/cat1.png"} 
                            alt="Profile" 
                            className="w-full h-full object-cover" 
                        />
                    </Link>

                    {/* Hover Card */}
                    <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100 z-50">
                        <div className="flex flex-col gap-3">
                            {/* Header */}
                            <div className="pb-3 border-b border-gray-50">
                                <h4 className="font-bold text-gray-900 truncate text-lg leading-tight">{user?.name || "Explorer"}</h4>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wide mt-1">Language Student</p>
                            </div>
                            
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-2">
                                {/* Streak */}
                                <div className="bg-orange-50/50 rounded-xl p-3 flex flex-col items-center justify-center border border-orange-100 hover:bg-orange-50 transition-colors">
                                    <FaFire className="text-orange-500 mb-1.5" size={16} />
                                    <span className="text-lg font-black text-orange-600 leading-none">{streak}</span>
                                    <span className="text-[9px] text-orange-400 font-bold uppercase tracking-wider mt-1">Streak</span>
                                </div>
                                
                                {/* Level */}
                                <div className="bg-yellow-50/50 rounded-xl p-3 flex flex-col items-center justify-center border border-yellow-100 hover:bg-yellow-50 transition-colors">
                                    <FaCrown className="text-yellow-500 mb-1.5" size={16} />
                                    <span className="text-lg font-black text-yellow-600 leading-none">{level}</span>
                                    <span className="text-[9px] text-yellow-500 font-bold uppercase tracking-wider mt-1">Level</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Tiny arrow decoration */}
                        <div className="absolute top-0 right-4 -mt-1.5 w-3 h-3 bg-white border-t border-l border-gray-100 transform rotate-45"></div>
                    </div>
                </div>
            ) : (
                /* Public Navigation */
                <nav className="flex items-center gap-6 pointer-events-auto">
                    <Link to="/services" className="text-gray-600 hover:text-black font-medium text-sm transition-colors no-underline">Services</Link>
                    <Link to="/about" className="text-gray-600 hover:text-black font-medium text-sm transition-colors no-underline">About</Link>
                    <Link to="/contact" className="text-gray-600 hover:text-black font-medium text-sm transition-colors no-underline">Contact</Link>
                    <div className="w-px h-4 bg-gray-300 mx-2"></div>
                    <Link to="/login" className="text-gray-900 hover:text-black font-bold text-sm transition-colors no-underline">Log In</Link>
                    <Link to="/signup" className="px-4 py-2 bg-black text-white rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors shadow-sm no-underline">Join</Link>
                </nav>
            )}
		</header>
	);
}


