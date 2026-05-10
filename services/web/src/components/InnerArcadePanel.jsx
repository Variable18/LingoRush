import "./InnerArcadePanel.css";

// Load all SVG icons from assets/objects
const iconModules = import.meta.glob("../assets/objects/*.svg", { eager: true });
const icons = Object.entries(iconModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, mod]) => mod.default);

export default function InnerArcadePanel() {
  function handlePress(el) {
    try { if (navigator?.vibrate) navigator.vibrate(10); } catch {}
    if (!el) return;
    el.classList.remove("is-pressed");
    // Trigger reflow to restart animation if already pressed
    void el.offsetWidth;
    el.classList.add("is-pressed");
    // Clean up class after animation
    setTimeout(() => el.classList.remove("is-pressed"), 240);
  }

  function onIconClick(e) {
    handlePress(e.currentTarget);
  }

  function onIconKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handlePress(e.currentTarget);
    }
  }

  return (
    <div className="inner-arcade-panel" role="toolbar" aria-label="Arcade status icons">
      <div className="panel-glass" />
      <div className="icon-row">
        {icons.map((src, i) => (
          <img
            key={src + i}
            src={src}
            alt="status icon"
            className="panel-icon"
            tabIndex={0}
            role="button"
            onClick={onIconClick}
            onKeyDown={onIconKeyDown}
          />
        ))}
      </div>
    </div>
  );
}
