import { NavLink } from "react-router-dom";
import styles from "./navbar.module.css";

const Navbar = () => {
  return (
    <nav className={styles.nav} aria-label="Primary">
      <ul className={styles.list}> 
        {[
          { to: "/", label: "Home" },
          { to: "/about", label: "About" },
          { to: "/services", label: "Services" },
          { to: "/contact", label: "Contact" },
          { to: "/login", label: "Login" },
          { to: "/signup", label: "Sign Up" }
        ].map((item) => (
          <li key={item.to}>
            <NavLink to={item.to} className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
