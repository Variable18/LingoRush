import { useState } from "react";
import { FiLock, FiMail, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import SignupIllustration from "../assets/illustrations/signup.svg?react";
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

export default function SignupPage() {
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithGithub, signupWithEmail } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignup = async () => {
    await signInWithGoogle();
    navigate("/home");
  };

  const handleGithubSignup = async () => {
    await signInWithGithub();
    navigate("/home");
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signupWithEmail({ name, email, password });
      navigate("/home");
    } catch (err) {
      setError(err?.data?.error || err.message || "Signup failed");
    } finally {
      setLoading(false);
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
            <h1 className={styles.headline}>
              <span className="hero-line">Join the system, </span>
            </h1>
            <p className={`${styles.sub} hero-line motion-fade-up delay-1`}>One account across devices. Premium, quiet, intentional.</p>
          </div>

          <div className={`${styles.split} motion-fade-up delay-2`}>
            <figure className={`${styles.figure} ${styles.pane}`}>
              <div className={styles.figureInner}>
                <SignupIllustration />
              </div>
            </figure>
            <div className={`${styles.pane} motion-fade-up delay-3`}>
              <form onSubmit={handleEmailSignup} style={{ maxWidth: 420, width: '100%', marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Input icon={FiUser} type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                <Input icon={FiMail} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input icon={FiLock} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {error && (<p style={{ color: '#b00020', fontSize: '0.9rem' }}>{error}</p>)}
                <button type="submit" className={styles.primaryBtn} disabled={loading} style={{ background: '#111', color: '#fff', borderRadius: 10, padding: '12px 14px', border: '1px solid #111' }}>
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </form>
              <p style={{ marginTop: '12px', fontSize: '0.9rem', color: '#666' }}>Already have an account? <Link to="/login" style={{ color: 'var(--accent)' }}>Log in</Link></p>
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
