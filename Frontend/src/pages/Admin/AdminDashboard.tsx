// pages/AdminDashboard.tsx
import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "../../components/Admin/AdminDashboard.module.css";
import API from "../../services/api";

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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await API.getAdminDashboardStats();
        console.log("Fetched stats:", statsData); // For debugging
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
    <div className={styles.dashboardContainer}>
      {/* Sidebar - unchanged */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>TetouanCars Admin</div>
        <nav>
          <Link
            to="reservations"
            className={`${styles.navLink} ${isActive("reservations") ? styles.navLinkActive : ""}`}
          >
            Réservations
          </Link>
          <Link
            to="clients"
            className={`${styles.navLink} ${isActive("clients") ? styles.navLinkActive : ""}`}
          >
            Clients
          </Link>
          <Link
            to="managers"
            className={`${styles.navLink} ${isActive("managers") ? styles.navLinkActive : ""}`}
          >
            Managers
          </Link>
          <Link
            to="voitures"
            className={`${styles.navLink} ${isActive("voitures") ? styles.navLinkActive : ""}`}
          >
            Voitures
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Header - unchanged */}
        <header className={styles.header}>
          <h2 className={styles.headerTitle}>Tableau de bord</h2>
          <div className={styles.userProfile}>
            <span>Admin</span>
            <div className={styles.userAvatar}>A</div>
          </div>
        </header>

        {/* SIMPLIFIED STATS DISPLAY */}
        <main className={styles.contentArea}>
          
            <div style={{ marginBottom: '20px' }}>
              <h3>Statistiques</h3>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '20px',
                marginBottom: '20px'
              }}>
                {stats.map((stat, index) => (
                  <div 
                    key={stat.title} 
                    style={{
                      background: 'white',
                      padding: '15px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                      minWidth: '200px',
                      flex: 1
                    }}
                  >
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#666',
                      marginBottom: '5px'
                    }}>
                      {stat.title}
                    </div>
                    <div style={{ 
                      fontSize: '24px', 
                      fontWeight: 'bold' 
                    }}>
                      {stat.value}
                    </div>
                    {stat.change !== undefined && (
                      <div style={{ 
                        color: stat.change >= 0 ? 'green' : 'red',
                        marginTop: '5px',
                        fontSize: '14px'
                      }}>
                        {stat.change >= 0 ? "↑" : "↓"} {Math.abs(stat.change)}% 
                        vs mois dernier
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          
          <div className={styles.contentCard}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;