import { useState } from "react";
import { FiLock, FiMail } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import LoginIllustration from "../assets/illustrations/login.svg?react";
import Navbar from "../components/minimal/Navbar";
import { useAuth } from "../context/AuthContext";
import styles from "./LandingNew.module.css";

const Input = ({ icon: Icon, ...props }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    {Icon && <Icon style={{ marginRight: '8px', color: '#666' }} />}
    <input
      {...props}
      style={{
        width: '100%',
        background: '#fff',
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '12px 14px',
        color: '#111',
        outline: 'none'
      }}
      onFocus={(e) => (e.target.style.borderColor = '#bbb')}
      onBlur={(e) => (e.target.style.borderColor = '#ddd')}
    />
  </div>
);

export default function LoginPage() {
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithGithub } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleGoogleLogin = async () => {
    setErrorMessage("");
    await signInWithGoogle();
    navigate("/home");
  };

  const handleGithubLogin = async () => {
    setErrorMessage("");
    await signInWithGithub();
    navigate("/home");
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const { token, user } = await api.login({ email, password });
      localStorage.setItem("lingorush_token", token);
      localStorage.setItem("lingorush_user", JSON.stringify(user));
      setErrorMessage("");
      navigate("/home");
    } catch (err) {
      const msg = err?.data?.error || err.message || "Invalid email or password";
      setErrorMessage(msg);
    }
  };

  return (
    <div className={`${styles.page} motion-fade-in`}>
      <main className={`${styles.container} motion-fade-up`} style={{ position: 'relative', overflow: 'hidden', '--dur-base': '420ms', '--easing-soft': 'var(--easing-deluxe)' }}>
        <div aria-hidden className="bg-drift-slow bg-pulse" style={{ position: 'absolute', inset: '-10%', background: 'radial-gradient(40% 30% at 50% 0%, rgba(0,0,0,0.06), transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />
        <header style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '2rem', display: 'flex', justifyItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#333', fontWeight: 600, fontSize: '1rem', letterSpacing: '0.05em' }}>
            LingoRush
          </Link>
        </header>
        <section className={`${styles.hero} motion-scale-in`}>
          <div>
            <div className={styles.kicker} />
            <h1 className={`${styles.headline}`}>
              <span className="hero-line">Login </span>
            </h1>
            <p className={`${styles.sub} hero-line motion-fade-up delay-1`}>Sign in with calm. No noise, only essentials.</p>
          </div>

          <div className={`${styles.split} motion-fade-up delay-2`}>
            <figure className={`${styles.figure} ${styles.pane}`}>
              <div className={styles.figureInner}>
                <LoginIllustration />
              </div>
            </figure>
            <div className={`${styles.pane} motion-fade-up delay-3`}>
                {/* Inline error message (no popups) */}
                {errorMessage && (
                  <div role="alert" className="motion-fade-up" style={{
                    marginTop: '1rem',
                    marginBottom: '0.5rem',
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: '1px solid #e33',
                    background: 'rgba(227, 51, 51, 0.08)',
                    color: '#b11212',
                    fontSize: '0.95rem'
                  }}>
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleEmailLogin} style={{ maxWidth: 420, width: '100%', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Input icon={FiMail} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input icon={FiLock} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" className={styles.primaryBtn} style={{ background: '#111', color: '#fff', borderRadius: 10, padding: '12px 14px', border: '1px solid #111' }}>Sign In</button>
              </form>
              <p style={{ marginTop: '12px', fontSize: '0.9rem', color: '#666' }}>Don't have an account? <Link to="/signup" style={{ color: 'var(--accent)' }}>Sign up</Link></p>
            </div>
          </div>
        </section>
        <div className={`${styles.midNavStage} motion-fade-up delay-2`}>
          <Navbar />
        </div>
      </main>
    </div>
  );
}