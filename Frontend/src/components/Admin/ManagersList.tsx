import { useEffect, useState } from "react";
import { Manager } from "../../types/manager"; // correct
import API from "../../services/api"; // API usage
import AdminLayout from "../../components/AdminLayout";
import { Search, X, Plus, Trash2, Edit2, Check, ChevronDown, ChevronUp, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ManagerFormData = {
  nom: string;
  prenom: string;
  email: string;
  mot_de_passe: string;
  telephone: string;
  statut: "actif" | "inactif";
};

const ManagersList = () => {
  const { toast } = useToast();
  const [managers, setManagers] = useState<Manager[]>([]);
  const [filteredManagers, setFilteredManagers] = useState<Manager[]>([]);
  const [newManager, setNewManager] = useState<ManagerFormData>({
    nom: "",
    prenom: "",
    email: "",
    mot_de_passe: "",
    telephone: "",
    statut: "actif",
  });
  const [editingManager, setEditingManager] = useState<Manager | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // États pour les filtres et la recherche
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"tous" | "actif" | "inactif">("tous");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Manager; direction: 'asc' | 'desc' } | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const fetchManagers = async () => {
    try {
      const data = await API.getManagers();
      setManagers(data);
      setFilteredManagers(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching managers:", error);
      setLoading(false);
      toast({
        title: "Erreur",
        description: "Impossible de charger les managers",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  // Appliquer les filtres et la recherche
  useEffect(() => {
    let result = [...managers];
    
    // Filtre par statut
    if (statusFilter !== "tous") {
      result = result.filter(manager => manager.statut === statusFilter);
    }
    
    // Recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(manager => 
        manager.nom.toLowerCase().includes(term) ||
        manager.prenom.toLowerCase().includes(term) ||
        manager.email.toLowerCase().includes(term) ||
        manager.telephone.includes(term)
      );
    }
    
    if (sortConfig !== null) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredManagers(result);
  }, [managers, searchTerm, statusFilter, sortConfig]);

  const requestSort = (key: keyof Manager) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const re = /^\+212 [567]\d{8}$/;
    return re.test(phone);
  };

  const validateForm = (manager: ManagerFormData, isEditing = false): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!manager.nom.trim()) newErrors.nom = "Nom obligatoire";
    if (!manager.prenom.trim()) newErrors.prenom = "Prénom obligatoire";
    
    if (!manager.email.trim()) {
      newErrors.email = "Email obligatoire";
    } else if (!validateEmail(manager.email)) {
      newErrors.email = "Format d'email invalide";
    }
    
    if (!manager.mot_de_passe && !isEditing) newErrors.mot_de_passe = "Mot de passe obligatoire";
    
    if (!manager.telephone.trim()) {
      newErrors.telephone = "Téléphone obligatoire";
    } else if (!validatePhoneNumber(manager.telephone)) {
      newErrors.telephone = "Format invalide. Utilisez: +212 5XXXXXXXX, +212 6XXXXXXXX ou +212 7XXXXXXXX";
    }
    
    if (manager.email) {
      const emailExists = managers.some(m => 
        m.email === manager.email && 
        (isEditing ? m._id !== editingManager?._id : true)
      );
      if (emailExists) newErrors.email = "Cet email est déjà utilisé";
    }
    
    if (manager.telephone) {
      const telephoneExists = managers.some(m => 
        m.telephone === manager.telephone && 
        (isEditing ? m._id !== editingManager?._id : true)
      );
      if (telephoneExists) newErrors.telephone = "Ce téléphone est déjà utilisé";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async () => {
    if (!validateForm(newManager)) return;

    try {
      const now = new Date();
      const managerData = {
        ...newManager,
        date_creation: now.toISOString()
      };

      await API.addManager(managerData);
      
      setNewManager({
        nom: "",
        prenom: "",
        email: "",
        mot_de_passe: "",
        telephone: "",
        statut: "actif",
      });
      
      setShowAddModal(false);
      toast({
        title: "Succès",
        description: "Manager ajouté avec succès",
      });
      fetchManagers();
    } catch (error) {
      console.error("Error adding manager:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le manager",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async () => {
    if (!editingManager) return;
    
    const formData: ManagerFormData = {
      nom: editingManager.nom,
      prenom: editingManager.prenom,
      email: editingManager.email,
      mot_de_passe: editingManager.mot_de_passe || "",
      telephone: editingManager.telephone,
      statut: editingManager.statut
    };
    
    if (!validateForm(formData, true)) return;

    try {
      const updateData = {
        nom: editingManager.nom,
        prenom: editingManager.prenom,
        telephone: editingManager.telephone,
        statut: editingManager.statut,
        ...(editingManager.mot_de_passe && { mot_de_passe: editingManager.mot_de_passe })
      };

      await API.updateManager(editingManager._id, updateData);
      setEditingManager(null);
      toast({
        title: "Succès",
        description: "Manager mis à jour avec succès",
      });
      fetchManagers();
    } catch (error) {
      console.error("Error updating manager:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le manager",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce manager ?")) {
      try {
        await API.deleteManager(id);
        toast({
          title: "Succès",
          description: "Manager supprimé avec succès",
        });
        fetchManagers();
      } catch (error) {
        console.error("Error deleting manager:", error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le manager",
          variant: "destructive",
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("tous");
    setSortConfig(null);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="managers-container">
          <div className="managers-header">
            <div>
              <h1 className="managers-title">Gestion des Managers</h1>
             
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="add-button"
            >
              <Plus size={18} />
              <span>Ajouter un Manager</span>
            </button>
          </div>

          {/* Barre de recherche et filtres */}
          <div className="search-filter-container">
            <div className="search-bar">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Rechercher par nom, prénom, email ou téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm("")}>
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="filter-section">
              <button 
                className={`filter-toggle-button ${showFilters ? 'active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} />
                <span>Filtres</span>
                {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {showFilters && (
                <div className="filter-dropdown">
                  <div className="filter-group">
                    <label className="filter-label">Statut :</label>
                    <div className="filter-options">
                      <button 
                        className={`filter-option ${statusFilter === "tous" ? "selected" : ""}`}
                        onClick={() => setStatusFilter("tous")}
                      >
                        Tous
                      </button>
                      <button 
                        className={`filter-option ${statusFilter === "actif" ? "selected" : ""}`}
                        onClick={() => setStatusFilter("actif")}
                      >
                        Actifs
                      </button>
                      <button 
                        className={`filter-option ${statusFilter === "inactif" ? "selected" : ""}`}
                        onClick={() => setStatusFilter("inactif")}
                      >
                        Inactifs
                      </button>
                    </div>
                  </div>

                  <button className="reset-filters" onClick={resetFilters}>
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Liste des managers */}
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Chargement des managers...</p>
            </div>
          ) : filteredManagers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>Aucun manager trouvé</h3>
              <p>Modifiez vos filtres ou ajoutez un nouveau manager</p>
            </div>
          ) : (
            <div className="managers-table-container">
              <table className="managers-table">
                <thead>
                  <tr>
                    <th onClick={() => requestSort('nom')}>
                      <div className="th-content">
                        Nom
                        {sortConfig?.key === 'nom' && (
                          sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        )}
                      </div>
                    </th>
                    <th onClick={() => requestSort('prenom')}>
                      <div className="th-content">
                        Prénom
                        {sortConfig?.key === 'prenom' && (
                          sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        )}
                      </div>
                    </th>
                    <th onClick={() => requestSort('email')}>
                      <div className="th-content">
                        Email
                        {sortConfig?.key === 'email' && (
                          sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        )}
                      </div>
                    </th>
                    <th>
                      <div className="th-content">Téléphone</div>
                    </th>
                    <th onClick={() => requestSort('date_creation')}>
                      <div className="th-content">
                        Date création
                        {sortConfig?.key === 'date_creation' && (
                          sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        )}
                      </div>
                    </th>
                    <th onClick={() => requestSort('statut')}>
                      <div className="th-content">
                        Statut
                        {sortConfig?.key === 'statut' && (
                          sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        )}
                      </div>
                    </th>
                    <th>
                      <div className="th-content">Actions</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredManagers.map((manager) => (
                    <tr key={manager._id} className="table-row">
                      <td>{manager.nom}</td>
                      <td>{manager.prenom}</td>
                      <td>{manager.email}</td>
                      <td>{manager.telephone}</td>
                      <td>{formatDate(manager.date_creation)}</td>
                      <td>
                        <span className={`status-badge ${manager.statut === 'actif' ? 'active' : 'inactive'}`}>
                          {manager.statut === 'actif' ? (
                            <>
                              <Check size={12} />
                              <span>Actif</span>
                            </>
                          ) : (
                            <>
                              <X size={12} />
                              <span>Inactif</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td>
                        <div className="actions-container">
                          <button 
                            onClick={() => setEditingManager({ ...manager, mot_de_passe: '' })}
                            className="action-button edit"
                            aria-label="Modifier"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(manager._id)}
                            className="action-button delete"
                            aria-label="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Modal d'ajout */}
          {showAddModal && (
            <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2 className="modal-title">Ajouter un nouveau Manager</h2>
                  <button className="modal-close" onClick={() => setShowAddModal(false)}>
                    <X size={20} />
                  </button>
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Nom*</label>
                    <input
                      type="text"
                      value={newManager.nom}
                      onChange={(e) => setNewManager({...newManager, nom: e.target.value})}
                      className={`form-input ${errors.nom ? 'input-error' : ''}`}
                    />
                    {errors.nom && <p className="error-message">{errors.nom}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Prénom*</label>
                    <input
                      type="text"
                      value={newManager.prenom}
                      onChange={(e) => setNewManager({...newManager, prenom: e.target.value})}
                      className={`form-input ${errors.prenom ? 'input-error' : ''}`}
                    />
                    {errors.prenom && <p className="error-message">{errors.prenom}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email*</label>
                    <input
                      type="email"
                      value={newManager.email}
                      onChange={(e) => setNewManager({...newManager, email: e.target.value})}
                      className={`form-input ${errors.email ? 'input-error' : ''}`}
                      placeholder="exemple@domaine.com"
                    />
                    {errors.email && <p className="error-message">{errors.email}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mot de passe*</label>
                    <input
                      type="password"
                      value={newManager.mot_de_passe}
                      onChange={(e) => setNewManager({...newManager, mot_de_passe: e.target.value})}
                      className={`form-input ${errors.mot_de_passe ? 'input-error' : ''}`}
                    />
                    {errors.mot_de_passe && <p className="error-message">{errors.mot_de_passe}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Téléphone*</label>
                    <input
                      type="text"
                      value={newManager.telephone}
                      onChange={(e) => setNewManager({...newManager, telephone: e.target.value})}
                      className={`form-input ${errors.telephone ? 'input-error' : ''}`}
                      placeholder="+212 6XXXXXXXX"
                    />
                    {errors.telephone && <p className="error-message">{errors.telephone}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Statut*</label>
                    <div className="toggle-container">
                      <div 
                        className={`status-toggle ${newManager.statut === 'actif' ? 'active' : 'inactive'}`}
                        onClick={() => setNewManager({
                          ...newManager, 
                          statut: newManager.statut === 'actif' ? 'inactif' : 'actif'
                        })}
                      >
                        <div className="toggle-handle"></div>
                        <span className="toggle-label">
                          {newManager.statut === 'actif' ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button 
                    onClick={() => {
                      setShowAddModal(false);
                      setErrors({});
                    }}
                    className="cancel-button"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={handleAdd}
                    className="submit-button"
                  >
                    <Plus size={18} />
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal de modification */}
          {editingManager && (
            <div className="modal-overlay" onClick={() => setEditingManager(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2 className="modal-title">Modifier Manager</h2>
                  <button className="modal-close" onClick={() => setEditingManager(null)}>
                    <X size={20} />
                  </button>
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Nom*</label>
                    <input
                      type="text"
                      value={editingManager.nom}
                      onChange={(e) => setEditingManager({...editingManager, nom: e.target.value})}
                      className={`form-input ${errors.nom ? 'input-error' : ''}`}
                    />
                    {errors.nom && <p className="error-message">{errors.nom}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Prénom*</label>
                    <input
                      type="text"
                      value={editingManager.prenom}
                      onChange={(e) => setEditingManager({...editingManager, prenom: e.target.value})}
                      className={`form-input ${errors.prenom ? 'input-error' : ''}`}
                    />
                    {errors.prenom && <p className="error-message">{errors.prenom}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email*</label>
                    <input
                      type="email"
                      value={editingManager.email}
                      onChange={(e) => setEditingManager({...editingManager, email: e.target.value})}
                      className={`form-input ${errors.email ? 'input-error' : ''} disabled`}
                      disabled
                    />
                    {errors.email && <p className="error-message">{errors.email}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nouveau mot de passe</label>
                    <input
                      type="password"
                      placeholder="Laisser vide pour ne pas changer"
                      value={editingManager.mot_de_passe || ''}
                      onChange={(e) => setEditingManager({...editingManager, mot_de_passe: e.target.value})}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Téléphone*</label>
                    <input
                      type="text"
                      value={editingManager.telephone}
                      onChange={(e) => setEditingManager({...editingManager, telephone: e.target.value})}
                      className={`form-input ${errors.telephone ? 'input-error' : ''}`}
                      placeholder="+212 6XXXXXXXX"
                    />
                    {errors.telephone && <p className="error-message">{errors.telephone}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Statut*</label>
                    <div className="toggle-container">
                      <div 
                        className={`status-toggle ${editingManager.statut === 'actif' ? 'active' : 'inactive'}`}
                        onClick={() => setEditingManager({
                          ...editingManager, 
                          statut: editingManager.statut === 'actif' ? 'inactif' : 'actif'
                        })}
                      >
                        <div className="toggle-handle"></div>
                        <span className="toggle-label">
                          {editingManager.statut === 'actif' ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button 
                    onClick={() => setEditingManager(null)}
                    className="cancel-button"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={handleUpdate}
                    className="update-button"
                  >
                    <Check size={18} />
                    Mettre à jour
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        /* Variables de couleurs */
        :root {
          --primary: #6366f1;
          --primary-light: #818cf8;
          --primary-dark: #4f46e5;
          --primary-hover: #4338ca;
          --primary-bg: rgba(99, 102, 241, 0.08);
          --success: #10b981;
          --success-light: #d1fae5;
          --danger: #ef4444;
          --danger-light: #fee2e2;
          --danger-bg: rgba(239, 68, 68, 0.08);
          --gray-50: #f9fafb;
          --gray-100: #f3f4f6;
          --gray-200: #e5e7eb;
          --gray-300: #d1d5db;
          --gray-400: #9ca3af;
          --gray-500: #6b7280;
          --gray-600: #4b5563;
          --gray-700: #374151;
          --gray-800: #1f2937;
          --gray-900: #111827;
          --box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          --box-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          --box-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          --border-radius: 0.5rem;
          --transition: all 0.2s ease;
        }

        /* Styles généraux */
        .managers-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 2rem;
          color: var(--gray-700);
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }
        
        /* En-tête */
        .managers-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .managers-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: var(--gray-900);
          margin-bottom: 0.5rem;
          background: linear-gradient(to right, var(--primary), var(--primary-dark));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.025em;
        }
        
        .managers-subtitle {
          font-size: 1rem;
          color: var(--gray-500);
        }
        
        /* Bouton d'ajout */
        .add-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: linear-gradient(to right, var(--primary), var(--primary-dark));
          color: white;
          border: none;
          border-radius: var(--border-radius);
          font-size: 0.9375rem;
          font-weight: 500;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
        }
        
        .add-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
        }
        
        .add-button:active {
          transform: translateY(0);
        }
        
        /* Section recherche et filtres */
        .search-filter-container {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          align-items: flex-start;
          flex-wrap: wrap;
        }
        
        .search-bar {
          position: relative;
          flex: 1;
          min-width: 300px;
        }
        
        .search-input {
          width: 100%;
          padding: 0.875rem 2.5rem 0.875rem 2.75rem;
          background-color: #f9fafc;
          border: 1px solid var(--gray-200);
          border-radius: var(--border-radius);
          font-size: 0.9375rem;
          transition: var(--transition);
        }
        
        .search-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
          background-color: white;
        }
        
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--gray-500);
        }
        
        .clear-search {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: var(--gray-200);
          border: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gray-600);
          cursor: pointer;
          transition: var(--transition);
        }
        
        .clear-search:hover {
          background: var(--gray-300);
          color: var(--gray-800);
        }
        
        /* Section filtres */
        .filter-section {
          position: relative;
        }
        
        .filter-toggle-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: white;
          border: 1px solid var(--gray-200);
          border-radius: var(--border-radius);
          font-size: 0.9375rem;
          color: var(--gray-700);
          cursor: pointer;
          transition: var(--transition);
          min-width: 120px;
          justify-content: center;
        }
        
        .filter-toggle-button:hover {
          background: var(--gray-50);
          border-color: var(--gray-300);
        }
        
        .filter-toggle-button.active {
          background: var(--primary-bg);
          border-color: var(--primary-light);
          color: var(--primary);
        }
        
        /* Dropdown des filtres */
        .filter-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid var(--gray-200);
          border-radius: var(--border-radius);
          padding: 1.5rem;
          margin-top: 0.5rem;
          box-shadow: var(--box-shadow-lg);
          z-index: 10;
          width: 280px;
          animation: slideDown 0.3s ease;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        
        .filter-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--gray-700);
        }
        
        .filter-options {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        
        .filter-option {
          padding: 0.5rem 1rem;
          background: var(--gray-100);
          border: 1px solid var(--gray-200);
          border-radius: var(--border-radius);
          font-size: 0.875rem;
          color: var(--gray-700);
          cursor: pointer;
          transition: var(--transition);
        }
        
        .filter-option:hover {
          background: var(--gray-200);
        }
        
        .filter-option.selected {
          background: var(--primary-bg);
          border-color: var(--primary-light);
          color: var(--primary);
          font-weight: 500;
        }
        
        .reset-filters {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 0.625rem;
          background: var(--gray-100);
          border: 1px solid var(--gray-200);
          border-radius: var(--border-radius);
          font-size: 0.875rem;
          color: var(--gray-700);
          cursor: pointer;
          transition: var(--transition);
        }
        
        .reset-filters:hover {
          background: var(--gray-200);
        }
        
        /* Tableau */
        .managers-table-container {
          overflow-x: auto;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow-md);
          border: 1px solid var(--gray-200);
          background: white;
        }
        
        .managers-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .managers-table th {
          background-color: var(--gray-50);
          padding: 1rem 1.5rem;
          text-align: left;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--gray-600);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--gray-200);
          cursor: pointer;
          user-select: none;
          position: sticky;
          top: 0;
          transition: var(--transition);
        }
        
        .th-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .managers-table th:hover {
          background-color: var(--gray-100);
        }
        
        .managers-table td {
          padding: 1.25rem 1.5rem;
          font-size: 0.9375rem;
          color: var(--gray-700);
          border-bottom: 1px solid var(--gray-100);
        }
        
        .table-row {
          transition: var(--transition);
        }
        
        .table-row:hover {
          background-color: var(--gray-50);
        }
        
        /* Badge de statut */
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.8125rem;
          font-weight: 500;
          transition: var(--transition);
        }
        
        .status-badge.active {
          background-color: var(--success-light);
          color: var(--success);
        }
        
        .status-badge.inactive {
          background-color: var(--danger-light);
          color: var(--danger);
        }
        
        /* Boutons d'action */
        .actions-container {
          display: flex;
          gap: 0.75rem;
        }
        
        .action-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: var(--border-radius);
          border: none;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: var(--box-shadow);
        }
        
        .action-button.edit {
          background-color: var(--primary-bg);
          color: var(--primary);
        }
        
        .action-button.edit:hover {
          background-color: var(--primary);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(99, 102, 241, 0.2);
        }
        
        .action-button.delete {
          background-color: var(--danger-bg);
          color: var(--danger);
        }
        
        .action-button.delete:hover {
          background-color: var(--danger);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(239, 68, 68, 0.2);
        }
        
        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .modal-content {
          background-color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow-lg);
          padding: 0;
          width: 100%;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
          animation: modalSlideIn 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid var(--gray-200);
        }
        
        .modal-title {
          font-size: 1.375rem;
          font-weight: 600;
          color: var(--gray-900);
          margin: 0;
        }
        
        .modal-close {
          background: none;
          border: none;
          color: var(--gray-500);
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          border-radius: 50%;
        }
        
        .modal-close:hover {
          color: var(--gray-900);
          background: var(--gray-100);
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          padding: 2rem;
        }
        
        .form-group {
          margin-bottom: 0.5rem;
        }
        
        .form-label {
          display: block;
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--gray-700);
          margin-bottom: 0.625rem;
        }
        
        .form-input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 1px solid var(--gray-300);
          border-radius: var(--border-radius);
          font-size: 0.9375rem;
          transition: var(--transition);
          background-color: white;
        }
        
        .form-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        
        .form-input.disabled {
          background-color: var(--gray-100);
          color: var(--gray-500);
          cursor: not-allowed;
        }
        
        .input-error {
          border-color: var(--danger);
        }
        
        .error-message {
          color: var(--danger);
          font-size: 0.8125rem;
          margin-top: 0.375rem;
          animation: errorShake 0.4s ease;
        }
        
        @keyframes errorShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(4px); }
          50% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        
        /* Toggle switch pour le statut */
        .toggle-container {
          display: flex;
          align-items: center;
        }
        
        .status-toggle {
          position: relative;
          display: flex;
          align-items: center;
          padding: 0.25rem;
          width: 120px;
          height: 42px;
          background: var(--gray-200);
          border-radius: 9999px;
          cursor: pointer;
          transition: var(--transition);
        }
        
        .status-toggle.active {
          background: var(--success);
        }
        
        .status-toggle.inactive {
          background: var(--danger);
        }
        
        .toggle-handle {
          position: absolute;
          width: 28px;
          height: 28px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease;
          top: 7px;
          left: 7px;
        }
        
        .status-toggle.active .toggle-handle {
          transform: translateX(78px);
        }
        
        .toggle-label {
          color: white;
          font-size: 0.875rem;
          font-weight: 500;
          margin-left: 40px;
          transition: var(--transition);
        }
        
        .status-toggle.inactive .toggle-label {
          margin-left: 14px;
        }
        
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding: 1.5rem 2rem;
          border-top: 1px solid var(--gray-200);
        }
        
        .submit-button, .update-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(to right, var(--primary), var(--primary-dark));
          color: white;
          border: none;
          border-radius: var(--border-radius);
          font-size: 0.9375rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: 0 4px 10px rgba(79, 70, 229, 0.2);
        }
        
        .submit-button:hover, .update-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(79, 70, 229, 0.3);
        }
        
        .cancel-button {
          padding: 0.75rem 1.5rem;
          background-color: white;
          border: 1px solid var(--gray-300);
          border-radius: var(--border-radius);
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--gray-700);
          cursor: pointer;
          transition: var(--transition);
        }
        
        .cancel-button:hover {
          background-color: var(--gray-100);
          border-color: var(--gray-400);
        }
        
        /* États de chargement et vide */
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          gap: 1.5rem;
          background: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
        }
        
        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(99, 102, 241, 0.2);
          border-radius: 50%;
          border-top-color: var(--primary);
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
          background: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          color: var(--gray-500);
        }
        
        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .empty-state h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--gray-700);
          margin-bottom: 0.75rem;
        }
        
        .empty-state p {
          font-size: 1rem;
          color: var(--gray-500);
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .managers-container {
            padding: 1.5rem;
          }
          
          .managers-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.5rem;
          }
          
          .add-button {
            width: 100%;
            justify-content: center;
          }
          
          .search-container {
            flex-direction: column;
            gap: 1rem;
          }
          
          .search-bar {
            width: 100%;
          }
          
          .filter-toggle-button {
            width: 100%;
            justify-content: center;
          }
          
          .filter-panel {
            padding: 1.25rem;
          }
          
          .filter-options {
            flex-direction: column;
            gap: 1.25rem;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
            padding: 1.5rem;
          }
          
          .modal-content {
            width: 92%;
            max-width: 92%;
          }
          
          .modal-header, .modal-actions {
            padding: 1.25rem 1.5rem;
          }
        }
        `}
      </style>
    </AdminLayout>
  );
};

export default ManagersList;
