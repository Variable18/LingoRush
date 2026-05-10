import "./RotatingLanguages.css";

export default function RotatingLanguages({ items = [] }) {
  // Duplicate items to create a seamless loop
  const loopItems = [...items, ...items];
  return (
    <div className="lang-reel">
      <div className="lang-track">
        {loopItems.map((lang, i) => (
          <div key={lang.name + i} className="lang-card">
            <span className="lang-name">{lang.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
