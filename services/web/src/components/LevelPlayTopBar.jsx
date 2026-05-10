
export default function LevelPlayTopBar() {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '12px 24px',
        background: 'transparent', 
        /* No backdrop-filter for glassmorphism */
      }}
    >
      <a 
        href="/home" 
        className="display-title" 
        style={{ 
          color: '#0a0a0a', 
          fontWeight: 800, 
          letterSpacing: 'var(--tracking-title)', 
          textDecoration: 'none',
          fontSize: '1.25rem' 
        }}
      >
        LingoRush
      </a>
    </header>
  );
}
