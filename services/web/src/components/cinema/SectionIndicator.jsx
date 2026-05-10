import React from "react";

export default function SectionIndicator({ current = 1, total = 2 }) {
  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3 text-gray-500">
      <span className="text-xs">{String(current).padStart(2, "0")}</span>
      <span className="h-px w-16 bg-white/20" />
      <span className="text-xs">{String(total).padStart(2, "0")}</span>
    </div>
  );
}
