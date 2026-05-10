
export default function MultiLangLogo() {
  const letters = ["Μ", "υ", "Л", "अ", "中", "ɡ", "ゴ", "ㅇ"];

  return (
    <div className="w-full flex items-center justify-center">
      <div className="bg-white text-black rounded-[40px] px-10 py-10 shadow-lg flex items-center justify-center">
        <div className="flex gap-5 md:gap-8">
          {letters.map((ch, i) => (
            <span
              key={i}
              className="font-extrabold leading-none"
              style={{ fontSize: "2rem",transform: "scaleY(1.1)" }}
            >
              {ch}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
