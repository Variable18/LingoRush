import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import TopBar from "../components/TopBar";
import SideNavbar from "../components/SideNavbar";
import ProfileActivity from "../components/ProfileActivity";
import { FaEdit, FaSave, FaTimes, FaEnvelope, FaPhone, FaUser, FaTrophy, FaBolt, FaStar } from "react-icons/fa";

// Avatar collections
const AVATARS = {
  cats: ["cat1.png", "cat2.png", "cat3.png"],
  dogs: ["chico.png", "dog1.png", "dog2.png", "dog3.png", "dog4.png", "dog5.png"]
};

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [navOpen, setNavOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  // Local state for form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  // Load user data into form
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || `user${Math.floor(Date.now() / 1000)}`,
        email: user.email || "",
        phone: user.phone || ""
      });
      // Ensure we have a default username saved if one isn't there
      if (!user.name) {
          updateProfile({ name: `user${Math.floor(Date.now() / 1000)}` });
      }
      // Ensure default avatar
      if (!user.avatar) {
          updateProfile({ avatar: "/cats/cat1.png" });
      }
    }
  }, [user]);

  const handleAvatarSelect = (filename, type) => {
    const fullPath = `/${type}/${filename}`;
    updateProfile({ avatar: fullPath });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
    setEditMode(false);
  };

  const getStats = () => [
    { label: "XP", value: user?.xp || 0, icon: FaStar, color: "#FFD700" },
    { label: "Level", value: user?.level || 1, icon: FaTrophy, color: "#FF0055" },
    { label: "Streak", value: 3, icon: FaBolt, color: "#00E676" }, // Mock streak for now
    { label: "Language", value: "German", icon: FaUser, color: "#3B82F6" }
  ];

  if (!user) return <div className="p-10 text-center">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-transparent text-gray-900 font-sans">
      <TopBar navOpen={navOpen} />
      <SideNavbar onOpenChange={setNavOpen} />

      <main 
        className="transition-all duration-300 ease-out pt-24 px-6 pb-12 mx-auto max-w-[95rem]"
        style={{ marginLeft: navOpen ? 280 : 0 }}
      >
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            
            {/* Left Column (Content) */}
            <div className="xl:col-span-2 space-y-6">
                
                {/* 1. Header Card */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 animate-fade-in-up">
                    <div className="relative group shrink-0">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-gray-100">
                            <img 
                                src={user.avatar || "/cats/cat1.png"} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute inset-0 rounded-full bg-[rgb(var(--color-card-inverse))]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <span className="text-white text-xs font-bold px-2 py-1 bg-[rgb(var(--color-card-inverse))]/50 rounded-full">Edit</span>
                        </div>
                    </div>
                
                    <div className="flex-1 text-center md:text-left space-y-2">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                            {formData.name}
                        </h1>
                        <p className="text-gray-500 font-medium">Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                        
                        {!editMode ? (
                            <button 
                                onClick={() => setEditMode(true)}
                                className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold transition-colors"
                            >
                                <FaEdit size={16} /> Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2 justify-center md:justify-start mt-2">
                                <button 
                                    onClick={handleSave}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#00E676] hover:bg-[#00C853] text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
                                >
                                    <FaSave size={16} /> Save
                                </button>
                                <button 
                                    onClick={() => { setEditMode(false); setFormData({...formData, name: user.name, email: user.email, phone: user.phone}); }}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm font-bold transition-colors"
                                >
                                    <FaTimes size={16} /> Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
                        {getStats().map((stat, i) => (
                            <div key={i} className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-xl border border-gray-100 min-w-[90px]">
                                <stat.icon size={20} color={stat.color} className="mb-1" />
                                <span className="text-lg font-black">{stat.value}</span>
                                <span className="text-xs text-gray-400 font-bold uppercase tracking-wide">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Avatar Selection */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight mb-6 flex items-center gap-2">
                        <span>🐱</span> Select Your Companion
                    </h3>
                    
                    <div className="space-y-6">
                        {/* Cats */}
                        <div>
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Cats</h4>
                            <div className="flex flex-wrap gap-4">
                                {AVATARS.cats.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => handleAvatarSelect(cat, 'cats')}
                                        className={`relative group transition-all duration-300 hover:scale-110 focus:outline-none ${user.avatar === `/cats/${cat}` ? 'scale-110' : 'opacity-70 hover:opacity-100'}`}
                                    >
                                        <div className={`w-16 h-16 rounded-full overflow-hidden border-4 ${user.avatar === `/cats/${cat}` ? 'border-[#00E676] ring-4 ring-[#00E676]/10 shadow-lg' : 'border-transparent hover:border-gray-100'}`}>
                                            <img src={`/cats/${cat}`} alt={cat} className="w-full h-full object-cover" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Dogs */}
                        <div>
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Dogs</h4>
                            <div className="flex flex-wrap gap-4">
                                {AVATARS.dogs.map(dog => (
                                    <button
                                        key={dog}
                                        onClick={() => handleAvatarSelect(dog, 'dogs')}
                                        className={`relative group transition-all duration-300 hover:scale-110 focus:outline-none ${user.avatar === `/dogs/${dog}` ? 'scale-110' : 'opacity-70 hover:opacity-100'}`}
                                    >
                                        <div className={`w-16 h-16 rounded-full overflow-hidden border-4 ${user.avatar === `/dogs/${dog}` ? 'border-[#00E676] ring-4 ring-[#00E676]/10 shadow-lg' : 'border-transparent hover:border-gray-100'}`}>
                                            <img src={`/dogs/${dog}`} alt={dog} className="w-full h-full object-cover" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Settings Form (Only visible in edit mode or always visible but subtle?) --> Let's keep it always visible but clean */}
                <div className={`bg-white rounded-3xl p-8 shadow-sm border border-gray-100 transition-all duration-300 animate-fade-in-up ${editMode ? 'ring-2 ring-[#00E676] shadow-lg scale-[1.01]' : ''}`} style={{ animationDelay: '200ms' }}>
                   <div className="flex items-center justify-between mb-6">
                       <h3 className="text-xl font-black text-gray-900 tracking-tight">Personal Details</h3>
                       {editMode && <span className="text-xs font-bold text-[#00E676] bg-[#00E676]/10 px-2 py-1 rounded-full animate-pulse">EDITING</span>}
                   </div>
                   
                   <form onSubmit={handleSave} className="space-y-5">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                           <div>
                               <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Display Name</label>
                               <div className="relative group">
                                   <FaUser className="absolute left-4 top-3.5 text-gray-300 group-focus-within:text-[#00E676] transition-colors" size={16} />
                                   <input 
                                       type="text" 
                                       value={formData.name}
                                       disabled={!editMode}
                                       onChange={e => setFormData({...formData, name: e.target.value})}
                                       className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-bold text-gray-700 focus:bg-white focus:border-[#00E676] focus:ring-4 focus:ring-[#00E676]/10 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                       placeholder="Enter your name"
                                   />
                               </div>
                           </div>
                           
                           <div>
                               <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Email Address</label>
                               <div className="relative group">
                                   <FaEnvelope className="absolute left-4 top-3.5 text-gray-300 group-focus-within:text-[#00E676] transition-colors" size={16} />
                                   <input 
                                       type="email" 
                                       value={formData.email}
                                       disabled={!editMode}
                                       onChange={e => setFormData({...formData, email: e.target.value})}
                                       className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-bold text-gray-700 focus:bg-white focus:border-[#00E676] focus:ring-4 focus:ring-[#00E676]/10 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                       placeholder="name@example.com"
                                   />
                               </div>
                           </div>
                       </div>

                       <div>
                           <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Phone Number</label>
                           <div className="relative group">
                               <FaPhone className="absolute left-4 top-3.5 text-gray-300 group-focus-within:text-[#00E676] transition-colors" size={16} />
                               <input 
                                   type="tel" 
                                   value={formData.phone}
                                   disabled={!editMode}
                                   onChange={e => setFormData({...formData, phone: e.target.value})}
                                   className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-bold text-gray-700 focus:bg-white focus:border-[#00E676] focus:ring-4 focus:ring-[#00E676]/10 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                   placeholder="+1 (555) 000-0000"
                               />
                           </div>
                       </div>
                   </form>
                </div>
            </div>

            {/* Right Column (Activity) */}
            <div className={`xl:col-span-1 transition-all duration-300 transform ${navOpen ? 'translate-x-0' : 'translate-x-0'}`}>
                <div className="sticky top-24">
                     {/* The Activity Card - Now a Feature Hero */}
                     <ProfileActivity compact={navOpen} />
                </div>
            </div>

        </div>
      </main>
    </div>
  );
}

