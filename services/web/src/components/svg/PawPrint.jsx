export default function PawPrint({ size = 22, color = "#9CA3AF" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill={color}
    >
      {/* Main pad */}
      <circle cx="256" cy="384" r="96" />
      {/* Toes */}
      <circle cx="128" cy="256" r="56" />
      <circle cx="384" cy="256" r="56" />
      <circle cx="192" cy="128" r="56" />
      <circle cx="320" cy="128" r="56" />
    </svg>
  );
}
