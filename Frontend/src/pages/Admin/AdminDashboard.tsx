// pages/AdminDashboard.tsx
import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "../../components/Admin/AdminDashboard.module.css";4
import API from '../../services/api';
import AdminLayout from "../../components/AdminLayout";

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
    try {
      const statsData = await API.getAdminDashboardStats();
      setStats(statsData);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchStats();
}, []);

  // Vérifie si le lien est actif
  const isActive = (path: string) => {
    return location.pathname === `/admin/${path}` || 
           location.pathname.startsWith(`/admin/${path}/`);
  };

  return (    
  
  <AdminLayout>
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <h2 className={styles.headerTitle}>Tableau de bord</h2>
        <div >
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

          <div >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
    </AdminLayout>
  );
};

export default AdminDashboard;