import { useEffect, useState } from "react";
import { getManagers, addManager, updateManager, deleteManager } from "../../services/api";

interface Manager {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  date_creation: string;
  statut: "actif" | "inactif";
}

const ManagersList = () => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [newManager, setNewManager] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    telephone: "",
    statut: "actif" as "actif" | "inactif",
  });
  const [editingManager, setEditingManager] = useState<Manager | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchManagers = async () => {
    try {
      const data = await getManagers();
      setManagers(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching managers:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const validateForm = (manager: typeof newManager, isEditing = false): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!manager.nom.trim()) newErrors.nom = "Nom obligatoire";
    if (!manager.prenom.trim()) newErrors.prenom = "Prénom obligatoire";
    if (!manager.email.trim()) newErrors.email = "Email obligatoire";
    if (!manager.password && !isEditing) newErrors.password = "Mot de passe obligatoire";
    if (!manager.telephone.trim()) newErrors.telephone = "Téléphone obligatoire";
    
    // Validation email unique
    if (manager.email && !isEditing) {
      const emailExists = managers.some(m => m.email === manager.email);
      if (emailExists) newErrors.email = "Cet email est déjà utilisé";
    }
    
    // Validation téléphone unique
    if (manager.telephone && !isEditing) {
      const telephoneExists = managers.some(m => m.telephone === manager.telephone);
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

      await addManager(managerData);
      
      setNewManager({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        telephone: "",
        statut: "actif",
      });
      
      fetchManagers();
    } catch (error) {
      console.error("Error adding manager:", error);
    }
  };

  const handleUpdate = async () => {
    if (!editingManager || !validateForm(editingManager, true)) return;

    try {
      await updateManager(editingManager._id, editingManager);
      setEditingManager(null);
      fetchManagers();
    } catch (error) {
      console.error("Error updating manager:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce manager ?")) {
      try {
        await deleteManager(id);
        fetchManagers();
      } catch (error) {
        console.error("Error deleting manager:", error);
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

  return (
    <div className="managers-container">
      <div className="managers-header">
        <h1 className="managers-title">Gestion des Managers</h1>
        <p className="managers-subtitle">Liste complète des managers enregistrés</p>
      </div>

      {/* Formulaire d'ajout */}
      <div className="add-manager-form">
        <h2 className="form-title">Ajouter un nouveau manager</h2>
        
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
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe*</label>
            <input
              type="password"
              value={newManager.password}
              onChange={(e) => setNewManager({...newManager, password: e.target.value})}
              className={`form-input ${errors.password ? 'input-error' : ''}`}
            />
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Téléphone*</label>
            <input
              type="text"
              value={newManager.telephone}
              onChange={(e) => setNewManager({...newManager, telephone: e.target.value})}
              className={`form-input ${errors.telephone ? 'input-error' : ''}`}
            />
            {errors.telephone && <p className="error-message">{errors.telephone}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Statut*</label>
            <select
              value={newManager.statut}
              onChange={(e) => setNewManager({...newManager, statut: e.target.value as "actif" | "inactif"})}
              className="form-input"
            >
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </select>
          </div>
        </div>

        <button 
          onClick={handleAdd} 
          className="submit-button"
        >
          Ajouter Manager
        </button>
      </div>

      {/* Liste des managers */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement des managers...</p>
        </div>
      ) : managers.length === 0 ? (
        <div className="empty-state">
          <p>Aucun manager enregistré</p>
        </div>
      ) : (
        <div className="managers-table-container">
          <table className="managers-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Date création</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {managers.map((manager) => (
                <tr key={manager._id}>
                  <td>{manager.nom}</td>
                  <td>{manager.prenom}</td>
                  <td>{manager.email}</td>
                  <td>{manager.telephone}</td>
                  <td>{formatDate(manager.date_creation)}</td>
                  <td>
                    <span className={`status-badge ${manager.statut === 'actif' ? 'active' : 'inactive'}`}>
                      {manager.statut === 'actif' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td>
                    <div className="actions-container">
                      <button 
                        onClick={() => setEditingManager(manager)}
                        className="edit-button"
                      >
                        Modifier
                      </button>
                      <button 
                        onClick={() => handleDelete(manager._id)}
                        className="delete-button"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de modification */}
      {editingManager && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Modifier Manager</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Nom*</label>
                <input
                  type="text"
                  value={editingManager.nom}
                  onChange={(e) => setEditingManager({...editingManager, nom: e.target.value})}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Prénom*</label>
                <input
                  type="text"
                  value={editingManager.prenom}
                  onChange={(e) => setEditingManager({...editingManager, prenom: e.target.value})}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email*</label>
                <input
                  type="email"
                  value={editingManager.email}
                  onChange={(e) => setEditingManager({...editingManager, email: e.target.value})}
                  className="form-input"
                  disabled
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nouveau mot de passe</label>
                <input
                  type="password"
                  placeholder="Laisser vide pour ne pas changer"
                  onChange={(e) => setEditingManager({...editingManager, password: e.target.value})}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Téléphone*</label>
                <input
                  type="text"
                  value={editingManager.telephone}
                  onChange={(e) => setEditingManager({...editingManager, telephone: e.target.value})}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Statut*</label>
                <select
                  value={editingManager.statut}
                  onChange={(e) => setEditingManager({...editingManager, statut: e.target.value as "actif" | "inactif"})}
                  className="form-input"
                >
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                onClick={handleUpdate}
                className="update-button"
              >
                Mettre à jour
              </button>
              <button 
                onClick={() => setEditingManager(null)}
                className="cancel-button"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .managers-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        .managers-header {
          margin-bottom: 2rem;
        }
        
        .managers-title {
          font-size: 1.75rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }
        
        .managers-subtitle {
          font-size: 1rem;
          color: #718096;
        }
        
        /* Formulaire d'ajout */
        .add-manager-form {
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .form-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 1.5rem;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #4a5568;
          margin-bottom: 0.5rem;
        }
        
        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 0.875rem;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
        }
        
        .input-error {
          border-color: #e53e3e;
        }
        
        .error-message {
          color: #e53e3e;
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }
        
        .submit-button {
          padding: 0.75rem 1.5rem;
          background-color: #4299e1;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.9375rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .submit-button:hover {
          background-color: #3182ce;
        }
        
        /* Tableau des managers */
        .managers-table-container {
          overflow-x: auto;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .managers-table {
          width: 100%;
          border-collapse: collapse;
          background-color: #ffffff;
        }
        
        .managers-table th {
          background-color: #f8fafc;
          padding: 1rem;
          text-align: left;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #4a5568;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .managers-table td {
          padding: 1rem;
          font-size: 0.875rem;
          color: #4b5563;
          border-bottom: 1px solid #f0f2f5;
        }
        
        .managers-table tr:hover {
          background-color: #f8fafc;
        }
        
        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .status-badge.active {
          background-color: #ebf8ff;
          color: #3182ce;
        }
        
        .status-badge.inactive {
          background-color: #fff5f5;
          color: #e53e3e;
        }
        
        .actions-container {
          display: flex;
          gap: 0.5rem;
        }
        
        .edit-button {
          padding: 0.5rem 0.75rem;
          background-color: #edf2f7;
          color: #4a5568;
          border: none;
          border-radius: 4px;
          font-size: 0.8125rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .edit-button:hover {
          background-color: #e2e8f0;
        }
        
        .delete-button {
          padding: 0.5rem 0.75rem;
          background-color: #fff5f5;
          color: #e53e3e;
          border: none;
          border-radius: 4px;
          font-size: 0.8125rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .delete-button:hover {
          background-color: #fed7d7;
        }
        
        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-content {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          padding: 2rem;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .modal-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 1.5rem;
        }
        
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        .update-button {
          padding: 0.75rem 1.5rem;
          background-color: #4299e1;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.9375rem;
          font-weight: 500;
          cursor: pointer;
        }
        
        .update-button:hover {
          background-color: #3182ce;
        }
        
        .cancel-button {
          padding: 0.75rem 1.5rem;
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 0.9375rem;
          font-weight: 500;
          color: #4a5568;
          cursor: pointer;
        }
        
        .cancel-button:hover {
          background-color: #f8fafc;
        }
        
        /* États */
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          gap: 1rem;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(66, 153, 225, 0.2);
          border-radius: 50%;
          border-top-color: #4299e1;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .empty-state {
          padding: 2rem;
          text-align: center;
          background-color: #f8fafc;
          border-radius: 8px;
          color: #718096;
        }
      `}</style>
    </div>
  );
};

export default ManagersList;