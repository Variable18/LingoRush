import React, { useMemo } from "react";
import franceFlag from "../../assets/flags/france.webp";
import germanFlag from "../../assets/flags/german.webp";
import portugalFlag from "../../assets/flags/portugal.webp";
import saudiFlag from "../../assets/flags/saudi.webp";
import southKoreanFlag from "../../assets/flags/south-korean.webp";
import spainFlag from "../../assets/flags/spain.webp";

const langs = [
  { name: "German", flag: germanFlag, href: "/learn/german" },
  { name: "French", flag: franceFlag },
  { name: "Spanish", flag: spainFlag },
  { name: "Portuguese", flag: portugalFlag },
  { name: "Arabic", flag: saudiFlag },
  { name: "Korean", flag: southKoreanFlag },
];

export default function LanguageOrbit() {

  const points = useMemo(() => {
    const radius = 140;
    const cx = 0, cy = 0;
    return langs.map((_, i) => {
      const t = (i / langs.length) * 2 * Math.PI;
      return { x: cx + radius * Math.cos(t), y: cy + radius * Math.sin(t) };
    });
  }, []);

  // animations removed

  return (
    <div className="relative h-[420px] w-[420px] flex items-center justify-center">
      {/* Disc backdrop with rim */}
      <div className="absolute h-72 w-72 rounded-full" style={{
        boxShadow: "0 0 0 1px rgba(255,255,255,0.08) inset, 0 0 40px rgba(255,255,255,0.06)",
        background: "radial-gradient(circle at 50% 45%, rgba(255,255,255,0.12), rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.6) 70%)"
      }} />

      {/* Orbit ring */}
      <div className="absolute h-[360px] w-[360px]">
        {points.map((p, i) => {
          const lang = langs[i];
          return (
            <div key={lang.name} className="absolute" style={{ transform: `translate(${180 + p.x}px, ${180 + p.y}px)` }}>
              <button
                className="group h-14 w-14 rounded-full border border-white/10 bg-[#0E1217] backdrop-blur-sm shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center"
                title={lang.name}
                onClick={() => lang.href && (window.location.href = lang.href)}
              >
                {lang.flag ? (
                  <img src={lang.flag} alt={lang.name} className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  <span className="text-xs text-gray-300">{lang.name[0]}</span>
                )}
                <span className="sr-only">{lang.name}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Center focal light */}
      <div className="relative h-24 w-24 rounded-full bg-[rgb(var(--color-card-inverse))]/60 border border-white/10 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full bg-white" />
      </div>
    </div>
  );
}
