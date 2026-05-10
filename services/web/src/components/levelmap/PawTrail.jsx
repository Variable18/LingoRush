import PawPrint from "../svg/PawPrint";

export default function PawTrail({ from, to, segmentIndex, globalStep }) {
  const steps = 4;

  // Anchor points
  const startX = from.x + 40;
  const startY = from.y + 80;
  const endX = to.x + 40;
  const endY = to.y;

  const dx = (endX - startX) / steps;
  const dy = (endY - startY) / steps;

  // Which paw should be active globally
  const activeGlobalIndex = globalStep % (steps * 100);

  return (
    <>
      {Array.from({ length: steps }, (_, i) => {
        // Map global step to this segment
        const globalPawIndex = segmentIndex * steps + i;
        const isActive = globalStep === globalPawIndex;

        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: startX + dx * (i + 1) + (i % 2 === 0 ? -10 : 10),
              top: startY + dy * (i + 1),
              transform: `
                rotate(${180 + i * 10}deg)
                scale(${isActive ? 1.15 : 1})
              `,
              opacity: isActive ? 1 : 0.4,
              transition: "all 0.3s ease",
            }}
          >
            <PawPrint
              size={22}
              color={isActive ? "#000" : "#bdbdbd"}
            />
          </div>
        );
      })}
    </>
  );
}
