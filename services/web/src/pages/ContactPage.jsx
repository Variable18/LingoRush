import { Link } from "react-router-dom";
import Navbar from "../components/minimal/Navbar";
import styles from "./LandingNew.module.css";
import ContactIllustration from "../assets/illustrations/contact.svg?react";

const ContactPage = () => {
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
          <h1 className={styles.headline}>Contact</h1>
          <p className={`${styles.sub} motion-fade-up delay-1`}>
            Questions, feedback, or partnerships—write to us and we’ll reply with care.
          </p>
          <p className={`${styles.sub} motion-fade-up delay-2`}><a href="mailto:support@lingorush.app">support@lingorush.app</a></p>
        </section>
        <div className={`${styles.midNavStage} motion-fade-up delay-2`}>
          <Navbar />
        </div>

        {/* Illustration with quotes, same editorial layout */}
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
            “Write with context. We’ll respond thoughtfully.”
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
            <ContactIllustration aria-label="Contact illustration" style={{ width: '100%', height: 'auto', display: 'block' }} />
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
            “We read every message.”
          </blockquote>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;
