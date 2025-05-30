import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./AdminLayout.module.css";
import API from "../services/api";

type Statistic = {
  title: string;
  value: number | string;
  change?: number;
  icon?: string;
};

const AdminLayout = () => {
  const location = useLocation();
  const [stats, setStats] = useState<Statistic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await API.getAdminDashboardStats();
        setStats(statsData);
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const isActive = (path: string) => {
    return location.pathname === `/admin/${path}` || 
           location.pathname.startsWith(`/admin/${path}/`);
  };

  return (
    <div className={styles.layoutContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>TetouanCars Admin</div>
        <nav className={styles.nav}>
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

        {/* Statistics Section */}
        <section className={styles.statsSection}>
          <h3 className={styles.statsTitle}>Statistiques</h3>
          <div className={styles.statsGrid}>
            {loading ? (
              <div className={styles.loading}>Chargement des statistiques...</div>
            ) : (
              stats.map((stat) => (
                <div key={stat.title} className={styles.statCard}>
                  <div className={styles.statHeader}>
                    <h4 className={styles.statTitle}>{stat.title}</h4>
                    {stat.icon && <span className={styles.statIcon}>{stat.icon}</span>}
                  </div>
                  <div className={styles.statValue}>{stat.value}</div>
                  {stat.change !== undefined && (
                    <div className={`${styles.statChange} ${stat.change >= 0 ? styles.positive : styles.negative}`}>
                      {stat.change >= 0 ? "↑" : "↓"} {Math.abs(stat.change)}% vs mois dernier
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Main Content Area */}
        <main className={styles.contentArea}>
          <div className={styles.contentCard}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 