import { Link } from "react-router-dom";
import AboutIllustration from "../assets/illustrations/about.svg?react";
import Navbar from "../components/minimal/Navbar";
import styles from "./LandingNew.module.css";

const AboutPage = () => {
  return (
    <div className={`${styles.page} motion-fade-in`}>
      <div className={`${styles.container} motion-fade-up`} style={{ position: 'relative', overflow: 'hidden', '--dur-base': '420ms', '--easing-soft': 'var(--easing-deluxe)' }}>
        <div aria-hidden className="bg-drift-slow bg-pulse" style={{ position: 'absolute', inset: '-10%', background: 'radial-gradient(40% 30% at 50% 0%, rgba(0,0,0,0.06), transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />
        <header style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '2rem', display: 'flex', justifyItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#333', fontWeight: 600, fontSize: '1rem', letterSpacing: '0.05em' }}>
            LingoRush
          </Link>
        </header>
        <section className={`${styles.hero} motion-scale-in`}>
          <h1 className={styles.headline}>A calmer way to learn</h1>
          <p className={`${styles.sub} motion-fade-up delay-1`}>
            LingoRush focuses on deliberate, interactive practice with a quiet interface. We keep typography crisp and
            spacing generous so your attention stays on the language.
          </p>
        </section>
        <div className={`${styles.midNavStage} motion-fade-up delay-2`}>
          <Navbar />
        </div>
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
          <blockquote className="motion-fade-up" style={{ justifySelf: 'end', color: 'var(--muted)', fontSize: '0.9rem', maxWidth: '22ch', lineHeight: 1.5, textAlign: 'right' }}>
            “Less noise. More language.”
          </blockquote>
          <div
            style={{
              width: '100%',
              maxWidth: 'clamp(420px, 50vw, 520px)',
              justifySelf: 'center',
              backgroundColor: 'transparent',
            }}
            className="motion-scale-in"
          >
            <AboutIllustration aria-label="About illustration" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
          <blockquote className="motion-fade-up delay-1" style={{ justifySelf: 'start', color: 'var(--muted)', fontSize: '0.9rem', maxWidth: '22ch', lineHeight: 1.5 }}>
            “Clarity, spacing, and steady practice.”
          </blockquote>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
