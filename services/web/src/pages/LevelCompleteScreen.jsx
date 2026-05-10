import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./LevelCompleteScreen.module.css";

export default function LevelCompleteScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const nextRoute = location.state?.next || "/learn/german";

  useEffect(() => {
    const t = setTimeout(() => {
      navigate(nextRoute, { replace: true });
    }, 5000); // must stay visible at least 5s
    return () => clearTimeout(t);
  }, [navigate, nextRoute]);

  return (
    <div className={styles.screen} aria-live="polite" aria-label="Level Complete">
      <h1 className={styles.title} data-text="LEVEL COMPLETE">LEVEL COMPLETE</h1>
    </div>
  );
}
