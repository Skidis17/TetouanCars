import { useEffect, useState } from "react";
import { getReservations, updateReservationStatus } from "../../services/api";
import styles from './ReservationsList.module.css';
import ReservationCalendar from './ReservationCalendar';
import ReservationDetails from './ReservationDetails';
import ReservationFilters from './ReservationFilters';
import { 
  FiCalendar, FiClock, FiCheckCircle, 
  FiXCircle, FiAlertCircle, FiChevronLeft, 
  FiChevronRight, FiEye
} from "react-icons/fi";
import { motion } from "framer-motion";
import { Reservation, ReservationStatus } from "../../types/reservation";

const ReservationsList = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [filters, setFilters] = useState({
    searchTerm: "",
    status: "all" as "all" | ReservationStatus,
    dateRange: {
      start: null as Date | null,
      end: null as Date | null
    }
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const reservationsData = await getReservations();
        setReservations(reservationsData);
        setFilteredReservations(reservationsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, reservations]);

  const applyFilters = () => {
    let result = [...reservations];

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(res => {
        const clientId = typeof res.client_id === 'object' ? res.client_id._id : res.client_id;
        const voitureId = typeof res.voiture_id === 'object' ? res.voiture_id._id : res.voiture_id;
        
        return (
          clientId.toLowerCase().includes(term) ||
          voitureId.toLowerCase().includes(term) ||
          res._id.toLowerCase().includes(term) ||
          res.statut.toLowerCase().includes(term)
        );
      });
    }

    if (filters.status !== "all") {
      result = result.filter(res => res.statut === filters.status);
    }

    if (filters.dateRange.start && filters.dateRange.end) {
      const start = filters.dateRange.start;
      const end = filters.dateRange.end;
      result = result.filter(res => {
        const dateDebut = new Date(res.date_debut);
        const dateFin = new Date(res.date_fin);
        return (dateDebut >= start && dateDebut <= end) || 
               (dateFin >= start && dateFin <= end);
      });
    }

    setFilteredReservations(result);
    setCurrentPage(1);
  };

  const handleStatusChange = async (id: string, status: ReservationStatus) => {
    try {
      await updateReservationStatus(id, status);
      setReservations(prev => 
        prev.map(res => 
          res._id === id ? { ...res, statut: status } : res
        )
      );
      setSelectedReservation(null);
    } catch (error) {
      console.error("Failed to update reservation status:", error);
    }
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case "acceptee": return <FiCheckCircle className={styles.statusAccepted} />;
      case "refusee": return <FiXCircle className={styles.statusRejected} />;
      case "annulee": return <FiXCircle className={styles.statusCancelled} />;
      case "terminee": return <FiCheckCircle className={styles.statusCompleted} />;
      default: return <FiAlertCircle className={styles.statusPending} />;
    }
  };

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case "en_attente": return "En attente";
      case "acceptee": return "Acceptée";
      case "refusee": return "Refusée";
      case "annulee": return "Annulée";
      case "terminee": return "Terminée";
      default: return statut;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const calculateDuration = (start: string, end: string) => {
    return Math.ceil(
      (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const paginatedReservations = filteredReservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={styles.dashboardCard}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Gestion des Réservations</h1>
          <p className={styles.subtitle}>
            {filteredReservations.length} réservations trouvées
          </p>
        </div>
        <div className={styles.viewToggle}>
          <button 
            onClick={() => setViewMode('list')} 
            className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
          >
            Liste
          </button>
          <button 
            onClick={() => setViewMode('calendar')} 
            className={`${styles.viewButton} ${viewMode === 'calendar' ? styles.active : ''}`}
          >
            Calendrier
          </button>
        </div>
      </div>

      {/* Filters */}
      <ReservationFilters 
        onFilterChange={setFilters}
        defaultFilters={filters}
      />

      {/* Main Content */}
      {viewMode === 'calendar' ? (
        <div className={styles.calendarContainer}>
          <ReservationCalendar 
            reservations={filteredReservations}
            onReservationClick={setSelectedReservation}
          />
        </div>
      ) : (
        <div className={styles.tableContainer}>
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Chargement des réservations...</p>
            </div>
          ) : filteredReservations.length > 0 ? (
            <>
              <table className={styles.reservationsTable}>
                <thead>
                  <tr>
                    <th>ID Réservation</th>
                    <th>Client</th>
                    <th>Véhicule</th>
                    <th>Période</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedReservations.map((reservation) => (
                    <motion.tr 
                      key={reservation._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className={styles.reservationRow}
                    >
                      <td>{reservation._id.substring(0, 8)}...</td>
                      <td>
                        {typeof reservation.client_id === 'object' ? (
                          `${reservation.client_id.prenom} ${reservation.client_id.nom}`
                        ) : (
                          reservation.client_id
                        )}
                      </td>
                      <td>
                        {typeof reservation.voiture_id === 'object' ? (
                          `${reservation.voiture_id.marque} ${reservation.voiture_id.modele}`
                        ) : (
                          reservation.voiture_id
                        )}
                      </td>
                      <td>
                        <div className={styles.datesInfo}>
                          <div className={styles.dateRange}>
                            <FiCalendar />
                            <span>{formatDate(reservation.date_debut)}</span>
                            <span className={styles.dateSeparator}>→</span>
                            <span>{formatDate(reservation.date_fin)}</span>
                          </div>
                          <div className={styles.duration}>
                            <FiClock />
                            {calculateDuration(reservation.date_debut, reservation.date_fin)} jours
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.statusBadge}>
                          {getStatusIcon(reservation.statut)}
                          {getStatusLabel(reservation.statut)}
                        </div>
                      </td>
                      <td>
                        <button 
                          className={styles.detailsButton}
                          onClick={() => setSelectedReservation(reservation)}
                          title="Voir les détails"
                        >
                          <FiEye />
                          <span>Détails</span>
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={styles.paginationButton}
                  >
                    <FiChevronLeft /> Précédent
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`${styles.paginationButton} ${
                          currentPage === pageNum ? styles.active : ''
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={styles.paginationButton}
                  >
                    Suivant <FiChevronRight />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <FiCalendar className={styles.emptyIcon} />
              <h3>Aucune réservation trouvée</h3>
              <p>Modifiez vos critères de recherche ou réinitialisez les filtres</p>
              <button 
                onClick={() => setFilters({
                  searchTerm: "",
                  status: "all",
                  dateRange: { start: null, end: null }
                })} 
                className={styles.resetAction}
              >
                Réinitialiser la recherche
              </button>
            </div>
          )}
        </div>
      )}

      {/* Reservation Details Modal */}
      {selectedReservation && (
        <ReservationDetails
          reservation={selectedReservation}
          open={!!selectedReservation}
          onClose={() => setSelectedReservation(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default ReservationsList;