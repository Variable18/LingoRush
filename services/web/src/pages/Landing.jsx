import { Link } from "react-router-dom";
import LandingSVG from "../assets/illustrations/landing.svg?react";
import styles from "./LandingNew.module.css";

const Landing = () => {
  return (
    <div className={`${styles.page} motion-fade-in`}>
      {/* Simple Text Header */}
      <header style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '2rem', display: 'flex', justifyItems: 'center', justifyContent: 'center', zIndex: 10 }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#333', fontWeight: 600, fontSize: '1rem', letterSpacing: '0.05em' }}>
          LingoRush
        </Link>
      </header>

      <div className={`${styles.container} motion-fade-up`} style={{ position: 'relative', overflow: 'hidden', '--dur-base': '420ms', '--easing-soft': 'var(--easing-deluxe)', paddingTop: '80px' }}>
        {/* Soft drifting radial background */}
        <div aria-hidden className="bg-drift-slow bg-pulse" style={{ position: 'absolute', inset: '-10%', background: 'radial-gradient(40% 30% at 50% 0%, rgba(0,0,0,0.06), transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />
        
        {/* Hero */}
        <section className={`${styles.hero} motion-scale-in`}>
          <h1 className={`${styles.headline} motion-fade-up`}>
            <i>L</i>ingoRush
          </h1>
          <p className={`${styles.sub} motion-fade-up delay-1`}>
            LingoRush is a quiet, deliberate way to practice speaking, reading, and building sentences—without noise.
            Progress is steady, typography is clean, focus stays on the words.
          </p>

          <nav className="motion-fade-up delay-2" style={{ marginTop: '5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '900px', marginInline: 'auto', padding: '0 1rem' }}>
            <Link to="/" className="nav-link" style={{ textDecoration: 'none', color: '#555', fontSize: '0.95rem', fontWeight: 500, letterSpacing: '0.03em', transition: 'color 0.2s' }}>Home</Link>
            <Link to="/about" className="nav-link" style={{ textDecoration: 'none', color: '#555', fontSize: '0.95rem', fontWeight: 500, letterSpacing: '0.03em', transition: 'color 0.2s' }}>About</Link>
            <Link to="/services" className="nav-link" style={{ textDecoration: 'none', color: '#555', fontSize: '0.95rem', fontWeight: 500, letterSpacing: '0.03em', transition: 'color 0.2s' }}>Services</Link>
            <Link to="/contact" className="nav-link" style={{ textDecoration: 'none', color: '#555', fontSize: '0.95rem', fontWeight: 500, letterSpacing: '0.03em', transition: 'color 0.2s' }}>Contact</Link>
            <Link to="/login" className="nav-link" style={{ textDecoration: 'none', color: '#555', fontSize: '0.95rem', fontWeight: 500, letterSpacing: '0.03em', transition: 'color 0.2s' }}>Login</Link>
            <Link to="/signup" className="nav-link" style={{ textDecoration: 'none', color: '#555', fontSize: '0.95rem', fontWeight: 500, letterSpacing: '0.03em', transition: 'color 0.2s' }}>Sign Up</Link>
          </nav>
        </section>

        {/* Static illustration with quotes left and right */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr minmax(0, auto) 1fr',
            gap: '3rem',
            alignItems: 'center',
            marginTop: '2rem',
          }}
          className="motion-fade-in delay-3"
       >
          <blockquote
            style={{
              justifySelf: 'end',
              color: 'var(--muted)',
              fontSize: '0.9rem',
              maxWidth: '22ch',
              lineHeight: 1.5,
              textAlign: 'right',
            }}
            className="motion-fade-up"
          >
            “Intentional practice. Quiet focus. Words, well-placed.”
          </blockquote>

          {/* Middle column: strictly constrained SVG container */}
          <div
            style={{
              width: '100%',
              maxWidth: 'clamp(420px, 50vw, 520px)',
              justifySelf: 'center',
              backgroundColor: '#f5f5f0',
            }}
            className="motion-scale-in"
          >
            <LandingSVG
              aria-label="LingoRush illustration"
              className={styles.landingIllustration}
              style={{ width: '100%', height: 'auto', display: 'block', backgroundColor: 'transparent' }}
            />
          </div>

          <blockquote
            style={{
              justifySelf: 'start',
              color: 'var(--muted)',
              fontSize: '0.9rem',
              maxWidth: '22ch',
              lineHeight: 1.5,
            }}
            className="motion-fade-up delay-1"
          >
            “Steady progress over noise. Quiet confidence.”
          </blockquote>
        </section>
      </div>
    </div>
  );
};

export default Landing;
