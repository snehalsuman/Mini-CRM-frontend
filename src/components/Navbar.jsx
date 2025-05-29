import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>Mini CRM</h2>
      {user && (
        <ul style={styles.navLinks}>
          <li><Link to="/dashboard" style={styles.link}>Dashboard</Link></li>
          <li><Link to="/customers" style={styles.link}>Customers</Link></li>
          <li><Link to="/segments" style={styles.link}>Segments</Link></li>
          <li><Link to="/campaigns" style={styles.link}>Campaigns</Link></li>
          <li><button onClick={handleLogout} style={styles.logoutBtn}>Logout</button></li>
        </ul>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#282c34",
    color: "white",
  },
  logo: {
    margin: 0,
  },
  navLinks: {
    display: "flex",
    gap: "1rem",
    listStyle: "none",
    margin: 0,
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "500",
  },
  logoutBtn: {
    backgroundColor: "#ff4d4d",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Navbar;
