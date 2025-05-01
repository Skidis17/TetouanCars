// src/components/Admin/ClientsList.tsx
import { useEffect, useState } from "react";
import { getClients } from "../../services/api";
import styles from './ClientsList.module.css';
import { FiSearch, FiFilter, FiX, FiCalendar, FiMapPin, FiUser, FiMail, FiPhone, FiDownload } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface Adresse {
  rue: string;
  ville: string;
  code_postal: string;
}

interface Client {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: Adresse;
  permis_conduire: string;
  date_ajout: string;
}

const ClientsList = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState({
    ville: "",
    dateStart: "",
    dateEnd: ""
  });
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getClients();
        setClients(data);
        setFilteredClients(data);
        setTimeout(() => setLoading(false), 800); // Delay for smooth transition
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
        Object.values(client).some(val => 
          typeof val === 'string' && val.toLowerCase().includes(term)
      ));
    }

    if (filters.ville) {
      result = result.filter(client => 
        client.adresse.ville.toLowerCase().includes(filters.ville.toLowerCase())
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
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilters({
      ville: "",
      dateStart: "",
      dateEnd: ""
    });
    setFiltersOpen(false);
  };

  return (
    <div className={styles.dashboardCard}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Gestion des Clients</h1>
          <p className={styles.subtitle}>Explorez et gérez votre base de clients</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
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

      {/* Filters Panel */}
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
                  <FiCalendar /> Période
                </label>
                <div className={styles.dateRange}>
                  <input
                    type="date"
                    value={filters.dateStart}
                    onChange={(e) => setFilters({...filters, dateStart: e.target.value})}
                    className={styles.dateInput}
                  />
                  <span className={styles.dateSeparator}>à</span>
                  <input
                    type="date"
                    value={filters.dateEnd}
                    onChange={(e) => setFilters({...filters, dateEnd: e.target.value})}
                    className={styles.dateInput}
                  />
                </div>
              </div>
            </div>

            <button onClick={resetFilters} className={styles.resetButton}>
              <FiX /> Réinitialiser
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Summary */}
      <div className={styles.resultsHeader}>
        <span className={styles.resultsCount}>
          {filteredClients.length} {filteredClients.length === 1 ? 'client' : 'clients'} trouvés
        </span>
      </div>

      {/* Clients Table */}
      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Chargement des clients...</p>
          </div>
        ) : filteredClients.length > 0 ? (
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
              {filteredClients.map((client) => (
                <motion.tr 
                  key={client._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className={styles.clientRow}
                >
                  <td>
                    <div className={styles.clientInfo}>
                      <div className={styles.avatar}>
                        {client.prenom.charAt(0)}{client.nom.charAt(0)}
                      </div>
                      <div>
                        <p className={styles.clientName}>{client.prenom} {client.nom}</p>
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
                    <span className={styles.licenseBadge}>
                      {client.permis_conduire}
                    </span>
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
    </div>
  );
};

export default ClientsList;