import { useEffect, useState } from "react";
import API from '../../services/api';
import styles from './ClientsList.module.css';
import { 
  FiSearch, FiFilter, FiX, FiCalendar, FiMapPin, 
  FiUser, FiMail, FiPhone, FiGrid, FiList, FiDownload,
  FiChevronLeft, FiChevronRight
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface Adresse {
  rue: string;
  ville: string;
  code_postal: string;
  pays?: string;
}

interface Client {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: Adresse;
  permis_conduire: string;
  numero_permis: string;
  date_expiration: string;
  CIN: string;
  date_ajout: string;
  photo?: string;
  Notes?: string;
}

const DateRangeFilter = ({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange 
}: {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    onStartDateChange(date);
    
    if (date && endDate && new Date(date) > new Date(endDate)) {
      setError("La date de début doit être avant la date de fin");
    } else {
      setError(null);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    onEndDateChange(date);
    
    if (date && startDate && new Date(date) < new Date(startDate)) {
      setError("La date de fin doit être après la date de début");
    } else {
      setError(null);
    }
  };

  return (
    <div className={styles.dateRangeContainer}>
      <div className={styles.filterLabel}>
        <FiCalendar /> Période d'inscription
      </div>
      
      <div className={styles.dateRangeGrid}>
        <div className={styles.dateInputGroup}>
          <label className={styles.dateLabel}>Du :</label>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className={styles.dateInput}
            max={endDate || undefined}
          />
        </div>
        
        <div className={styles.dateInputGroup}>
          <label className={styles.dateLabel}>Au :</label>
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            className={styles.dateInput}
            min={startDate || undefined}
          />
        </div>
      </div>
      
      {error && <div className={styles.dateError}>{error}</div>}
    </div>
  );
};

const ClientsList = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState({
    ville: "",
    permis: "",
    dateStart: "",
    dateEnd: ""
  });
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getClients();
        setClients(data);
        setFilteredClients(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching clients:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, clients]);

  const applyFilters = () => {
    let result = [...clients];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(client =>
        `${client.prenom} ${client.nom}`.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term) ||
        client.telephone.includes(term) ||
        client.CIN.toLowerCase().includes(term) ||
        client.adresse.ville.toLowerCase().includes(term)
      );
    }

    if (filters.ville) {
      result = result.filter(client => 
        client.adresse.ville.toLowerCase().includes(filters.ville.toLowerCase())
      );
    }

    if (filters.permis) {
      result = result.filter(client => 
        client.permis_conduire === filters.permis
      );
    }

    if (filters.dateStart && filters.dateEnd) {
      const start = new Date(filters.dateStart);
      const end = new Date(filters.dateEnd);
      result = result.filter(client => {
        const date = new Date(client.date_ajout);
        return date >= start && date <= end;
      });
    }

    setFilteredClients(result);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilters({
      ville: "",
      permis: "",
      dateStart: "",
      dateEnd: ""
    });
    setFiltersOpen(false);
  };

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderAvatar = (client: Client) => {
    if (client.photo) {
      return <img src={client.photo} alt={`${client.prenom} ${client.nom}`} className={styles.avatarImg} />;
    }
    return (
      <div className={styles.avatarFallback}>
        {client.prenom.charAt(0)}{client.nom.charAt(0)}
      </div>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const visiblePages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`${styles.pageButton} ${currentPage === i ? styles.activePage : ''}`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className={styles.pagination}>
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className={styles.navButton}
        >
          <FiChevronLeft />
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => setCurrentPage(1)}
              className={styles.pageButton}
            >
              1
            </button>
            {startPage > 2 && <span className={styles.pageEllipsis}>...</span>}
          </>
        )}
        
        {visiblePages}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className={styles.pageEllipsis}>...</span>}
            <button
              onClick={() => setCurrentPage(totalPages)}
              className={styles.pageButton}
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className={styles.navButton}
        >
          <FiChevronRight />
        </button>
      </div>
    );
  };

  return (
    <div className={styles.dashboardCard}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Gestion des Clients</h1>
          <p className={styles.subtitle}>Explorez et gérez votre base de clients</p>
        </div>
        <div className={styles.viewToggle}>
          <button 
            onClick={() => setViewMode('table')} 
            className={`${styles.viewButton} ${viewMode === 'table' ? styles.active : ''}`}
          >
            <FiList /> Tableau
          </button>
          <button 
            onClick={() => setViewMode('card')} 
            className={`${styles.viewButton} ${viewMode === 'card' ? styles.active : ''}`}
          >
            <FiGrid /> Cartes
          </button>
        </div>
      </div>

      <div className={styles.controlBar}>
        <div className={styles.searchContainer}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")} 
              className={styles.clearButton}
            >
              <FiX />
            </button>
          )}
        </div>

        <div className={styles.controlButtons}>
          <button 
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`${styles.filterButton} ${filtersOpen ? styles.active : ''}`}
          >
            <FiFilter /> Filtres
          </button>
        </div>
      </div>

      <AnimatePresence>
        {filtersOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.filtersPanel}
          >
            <div className={styles.filterGrid}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>
                  <FiMapPin /> Ville
                </label>
                <input
                  type="text"
                  value={filters.ville}
                  onChange={(e) => setFilters({...filters, ville: e.target.value})}
                  placeholder="Toutes les villes"
                  className={styles.filterInput}
                />
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>
                  <FiUser /> Type de permis
                </label>
                <select
                  value={filters.permis}
                  onChange={(e) => setFilters({...filters, permis: e.target.value})}
                  className={styles.filterInput}
                >
                  <option value="">Tous les permis</option>
                  <option value="B">Permis B</option>
                  <option value="C">Permis C</option>
                  <option value="D">Permis D</option>
                  <option value="EB">Permis EB</option>
                  <option value="EC">Permis EC</option>
                  <option value="ED">Permis ED</option>
                </select>
              </div>

              <DateRangeFilter
                startDate={filters.dateStart}
                endDate={filters.dateEnd}
                onStartDateChange={(date) => setFilters({...filters, dateStart: date})}
                onEndDateChange={(date) => setFilters({...filters, dateEnd: date})}
              />
            </div>

            <div className={styles.filterActions}>
              <button onClick={resetFilters} className={styles.resetButton}>
                <FiX /> Réinitialiser
              </button>
              <button onClick={() => setFiltersOpen(false)} className={styles.applyButton}>
                Appliquer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.resultsHeader}>
        <span className={styles.resultsCount}>
          {filteredClients.length} {filteredClients.length === 1 ? 'client' : 'clients'} trouvés
        </span>

      </div>

      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Chargement des clients...</p>
        </div>
      ) : filteredClients.length > 0 ? (
        <>
          {viewMode === 'table' ? (
            <div className={styles.tableContainer}>
              <table className={styles.clientsTable}>
                <thead>
                  <tr>
                    <th className={styles.nameColumn}>Client</th>
                    <th className={styles.contactColumn}>Contact</th>
                    <th className={styles.locationColumn}>Localisation</th>
                    <th className={styles.licenseColumn}>Permis</th>
                    <th className={styles.dateColumn}>Inscription</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedClients.map((client) => (
                    <motion.tr 
                      key={client._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className={styles.clientRow}
                    >
                      <td>
                        <div className={styles.clientInfo}>
                          {renderAvatar(client)}
                          <div>
                            <p className={styles.clientName}>{client.prenom} {client.nom}</p>
                            <p className={styles.clientCIN}>CIN: {client.CIN}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.contactInfo}>
                          <a href={`mailto:${client.email}`} className={styles.contactItem}>
                            <FiMail /> {client.email}
                          </a>
                          <a href={`tel:${client.telephone}`} className={styles.contactItem}>
                            <FiPhone /> {client.telephone}
                          </a>
                        </div>
                      </td>
                      <td>
                        <div className={styles.locationInfo}>
                          <FiMapPin /> {client.adresse.ville}, {client.adresse.code_postal}
                        </div>
                      </td>
                      <td>
                        <div className={styles.licenseInfo}>
                          <span className={styles.licenseBadge}>
                            {client.permis_conduire}
                          </span>
                          <small>Exp: {new Date(client.date_expiration).toLocaleDateString('fr-FR')}</small>
                        </div>
                      </td>
                      <td>
                        {new Date(client.date_ajout).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.cardsContainer}>
              {paginatedClients.map((client) => (
                <motion.div 
                  key={client._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={styles.clientCard}
                >
                  <div className={styles.cardHeader}>
                    {renderAvatar(client)}
                    <div className={styles.cardTitle}>
                      <h3>{client.prenom} {client.nom}</h3>
                      <p>CIN: {client.CIN}</p>
                    </div>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardField}>
                      <FiMail /> {client.email}
                    </div>
                    <div className={styles.cardField}>
                      <FiPhone /> {client.telephone}
                    </div>
                    <div className={styles.cardField}>
                      <FiMapPin /> {client.adresse.ville}, {client.adresse.code_postal}
                    </div>
                    <div className={styles.cardDetails}>
                      <div>
                        <label>Permis</label>
                        <span className={styles.licenseBadge}>
                          {client.permis_conduire}
                        </span>
                      </div>
                      <div>
                        <label>Expiration</label>
                        <span>{new Date(client.date_expiration).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.cardFooter}>
                    <span>
                      Inscrit le {new Date(client.date_ajout).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {renderPagination()}
        </>
      ) : (
        <div className={styles.emptyState}>
          <FiUser className={styles.emptyIcon} />
          <h3>Aucun client trouvé</h3>
          <p>Modifiez vos critères de recherche ou réinitialisez les filtres</p>
          <button onClick={resetFilters} className={styles.resetAction}>
            Réinitialiser la recherche
          </button>
        </div>
      )}
    </div>
  );
};

export default ClientsList;