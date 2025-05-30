// pages/AdminDashboard.tsx
import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "../../components/Admin/AdminDashboard.module.css";

// Type pour les statistiques
type Statistic = {
  title: string;
  value: number | string;
  change?: number;
  icon?: string;
};

const AdminDashboard = () => {
  const location = useLocation();
  const [stats, setStats] = useState<Statistic[]>([]);
  const [loading, setLoading] = useState(true);

  // Simuler le chargement des statistiques
  useEffect(() => {
    const fetchStats = async () => {
      // En production, vous feriez une requête API ici
      setTimeout(() => {
        setStats([
          { title: "Réservations ce mois", value: 42, change: 12 },
          { title: "Clients actifs", value: 156, change: -3 },
          { title: "Voitures disponibles", value: 28, change: 5 },
          { title: "Revenus (MAD)", value: "84,500", change: 18 },
        ]);
        setLoading(false);
      }, 800);
    };

    fetchStats();
  }, []);

  // Vérifie si le lien est actif
  const isActive = (path: string) => {
    return location.pathname === `/admin/${path}` || 
           location.pathname.startsWith(`/admin/${path}/`);
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>TetouanCars Admin</div>
        <nav>
          <Link
            to="/admin/reservations"
            className={`${styles.navLink} ${isActive("reservations") ? styles.navLinkActive : ""}`}
          >
            Réservations
          </Link>
          <Link
            to="/admin/clients"
            className={`${styles.navLink} ${isActive("clients") ? styles.navLinkActive : ""}`}
          >
            Clients
          </Link>
          <Link
            to="/admin/managers"
            className={`${styles.navLink} ${isActive("managers") ? styles.navLinkActive : ""}`}
          >
            Managers
          </Link>
          <Link
            to="/admin/voitures"
            className={`${styles.navLink} ${isActive("voitures") ? styles.navLinkActive : ""}`}
          >
            Voitures
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <h2 className={styles.headerTitle}>Tableau de bord</h2>
          <div className={styles.userProfile}>
            <span>Admin</span>
            <div className={styles.userAvatar}>A</div>
          </div>
        </header>

        {/* Content Area */}
        <main className={styles.contentArea}>
          {/* Afficher les statistiques seulement sur la page d'accueil */}
          {location.pathname === "/admin/dashboard" && (
            <div className={styles.statsContainer}>
              {stats.map((stat, index) => (
                <div 
                  key={stat.title} 
                  className={`${styles.statCard} ${styles.animatedCard} ${styles[`delay${index + 1}`]}`}
                >
                  <div className={styles.statTitle}>{stat.title}</div>
                  <div className={styles.statValue}>{stat.value}</div>
                  {stat.change && (
                    <div className={`${styles.statChange} ${
                      (stat.change || 0) >= 0 ? styles.changePositive : styles.changeNegative
                    }`}>
                      {stat.change >= 0 ? "↑" : "↓"} {Math.abs(stat.change)}% 
                      {stat.change >= 0 ? " vs mois dernier" : " vs mois dernier"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className={styles.contentCard}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;