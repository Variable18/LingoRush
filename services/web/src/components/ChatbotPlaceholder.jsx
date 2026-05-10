export default function ChatbotPlaceholder() {
  return (
    <div
      className="rounded-xl p-6"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px dashed var(--accent)",
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black" style={{ color: "#fff" }}>Assistant (Coming Soon)</h3>
        <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "var(--accent)" }}>beta</span>
      </div>
      <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
        A friendly chatbot will appear here to help with practice, hints, and explanations. We’ll wire it up later.
      </p>
      <div className="mt-4 h-24 rounded-lg" style={{ backgroundColor: "var(--bg)" }} />
    </div>
  );
}
