export default function LanguageCard({ title, flag, difficulty, progress = 0, onClick, surfaceColor, textColor }) {
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--mx", `${mx}%`);
    e.currentTarget.style.setProperty("--my", `${my}%`);
  };

  return (
    <button
      onClick={onClick}
      onMouseMove={handleMouseMove}
      className="group relative p-6 rounded-xl overflow-hidden"
      style={{ backgroundColor: surfaceColor || "var(--surface)", border: "1px solid rgba(0,0,0,0.08)" }}
    >
      {/* Glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(120px 120px at var(--mx, 50%) var(--my, 50%), rgba(255,0,85,0.12), transparent 60%)",
        }}
      />

      <div className="flex items-center gap-3 mb-4 relative z-10">
        <img src={flag} alt={title} className="w-10 h-7 rounded object-cover" />
        <h3 className="text-xl font-black" style={{ color: textColor || "#fff" }}>{title}</h3>
        <span
          className="ml-auto text-xs font-bold px-2 py-1 rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "var(--accent)" }}
        >
          {difficulty}
        </span>
      </div>

      {/* Progress */}
      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: surfaceColor ? "rgba(0,0,0,0.1)" : "var(--bg)" }}>
        <div
          className="h-full transition-all duration-500 group-hover:scale-y-110 origin-left"
          style={{ width: `${progress}%`, backgroundColor: "var(--accent)" }}
        />
      </div>
    </button>
  );
}
