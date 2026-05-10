import MinimalNavbar from "./MinimalNavbar";

export default function CinematicLayout({ children }) {
  return (
    <div className="min-h-screen overflow-hidden" style={{ color: 'var(--text)', background: 'var(--bg, #f7f7f5)' }}>
      <MinimalNavbar />
      <main className="pt-24">{children}</main>
    </div>
  );
}
