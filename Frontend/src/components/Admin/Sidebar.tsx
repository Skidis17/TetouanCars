// components/Admin/Sidebar.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import styles from "./AdminDashboard.module.css";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Vérifie si le lien est actif
  const isActive = (path: string) => {
    return location.pathname === `/admin/${path}` || 
           location.pathname.startsWith(`/admin/${path}/`);
  };

  const handleLogout = () => {
    // Ici vous ajouteriez la logique de déconnexion
    // Par exemple, supprimer le token JWT, effacer le contexte, etc.
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h1>TetouanCars</h1>
        <p className={styles.adminBadge}>Admin</p>
      </div>
      
      <nav className={styles.navContainer}>
        <Link
          to="reservations"
          className={`${styles.navLink} ${isActive("reservations") ? styles.navLinkActive : ""}`}
        >
          <span className={styles.linkIcon}>📋</span>
          Réservations
        </Link>
        <Link
          to="clients"
          className={`${styles.navLink} ${isActive("clients") ? styles.navLinkActive : ""}`}
        >
          <span className={styles.linkIcon}>👥</span>
          Clients
        </Link>
        <Link
          to="managers"
          className={`${styles.navLink} ${isActive("managers") ? styles.navLinkActive : ""}`}
        >
          <span className={styles.linkIcon}>👔</span>
          Managers
        </Link>
        <Link
          to="voitures"
          className={`${styles.navLink} ${isActive("voitures") ? styles.navLinkActive : ""}`}
        >
          <span className={styles.linkIcon}>🚗</span>
          Voitures
        </Link>
      </nav>

      <div className={styles.sidebarFooter}>
        <button onClick={handleLogout} className={styles.logoutButton}>
          <LogOut size={18} />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;