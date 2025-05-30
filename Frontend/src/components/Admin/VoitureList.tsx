import { useEffect, useState } from "react";
import axios from "axios";
import VoitureForm from "./VoitureForm";
import API from "../../services/api";
import { Voiture } from "../../types/car";
import AdminLayout from "../../components/AdminLayout";
import { Search, X, Plus, Trash2, Edit2, Check, ChevronDown, ChevronUp, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


const VoitureList = () => {
  const [voitures, setVoitures] = useState<Voiture[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVoiture, setEditingVoiture] = useState<Voiture | null>(null);
  const [loading, setLoading] = useState(true);

  const initialFormState: Omit<Voiture, '_id'> = {
    marque: '',
    model: '',
    annee: new Date().getFullYear(),
    immatriculation: '',
    couleur: '',
    kilometrage: 0,
    prix_journalier: 0,
    status: 'disponible',
    type_carburant: 'Essence',
    nombre_places: 5,
    options: [],
  };

const fetchVoitures = async () => {
  try {
    const data = await API.getVoitures();
    setVoitures(data);
    setLoading(false);
  } catch (error) {
   console.error("Error fetching voitures:", error, error?.response?.data);
    setLoading(false);
  }
};

  useEffect(() => {
    fetchVoitures();
  }, []);

  const handleSubmit = async (formData: FormData) => {
  try {
    if (editingVoiture) {
      await API.updateVoiture(editingVoiture._id, formData);
    } else {
      await API.addVoiture(formData);
    }
    setShowForm(false);
    fetchVoitures();
  } catch (error) {
    console.error("Error submitting voiture:", error);
  }
};

const handleDelete = async (id: string) => {
  if (window.confirm("Voulez-vous vraiment supprimer cette voiture ?")) {
    try {
      await API.deleteVoiture(id);
      fetchVoitures();
    } catch (error) {
      console.error("Error deleting voiture:", error);
    }
  }
};
  const openAddForm = () => {
    setEditingVoiture(null);
    setShowForm(true);
  };

  const openEditForm = (voiture: Voiture) => {
    setEditingVoiture(voiture);
    setShowForm(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponible': return 'bg-green-100 text-green-800';
      case 'reservee': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-blue-100 text-blue-800';
      case 'hors_service': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'disponible': return 'Disponible';
      case 'reservee': return 'Réservée';
      case 'maintenance': return 'En maintenance';
      case 'hors_service': return 'Hors service';
      default: return status;
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="voiture-list-container">
          <div className="list-header">
            <h1 className="list-title">Gestion des voitures</h1>
            
            
            <div className="list-actions">
              <button 
                onClick={openAddForm} 
                className="add-button"
              >
                Ajouter une Voiture
              </button>
            </div>
          </div>

          {showForm && (
            <div className="form-modal">
              <VoitureForm
                initialData={editingVoiture || initialFormState}
                editingVoiture={editingVoiture}
                onSubmit={handleSubmit}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Chargement des véhicules...</p>
            </div>
          ) : voitures.length === 0 ? (
            <div className="empty-state">
              <p>Aucun véhicule enregistré</p>
              <button onClick={openAddForm} className="add-button">
                Ajouter votre premier véhicule
              </button>
            </div>
          ) : (
            <div className="voiture-grid">
              {voitures.map(voiture => (
                <div key={voiture._id} className="voiture-card">
                  <div className="card-image-container">
                    {voiture.image_id ? (
                      <img 
                        src={`http://localhost:5000/api/image/${voiture.image_id}`}
                        alt={`${voiture.marque} ${voiture.modele}`}
                        className="card-image"
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null;
                          currentTarget.src = "https://via.placeholder.com/300";
                          currentTarget.className = "card-image placeholder-image";
                        }}
                      />
                    ) : (
                      <div className="card-image-placeholder">
                        <span>Pas d'image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="card-content">
                    <div className="card-header">
                      <h2 className="card-title">{voiture.marque} {voiture.modele}</h2>
                      <span className={`status-badge ${getStatusColor(voiture.status)}`}>
                        {getStatusLabel(voiture.status)}
                      </span>
                    </div>
                    
                    <div className="card-details">
                      <div className="detail-item">
                        <span className="detail-label">Année:</span>
                        <span>{voiture.annee}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Immatriculation:</span>
                        <span>{voiture.immatriculation}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Prix/jour:</span>
                        <span className="price">{voiture.prix_journalier} MAD</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Carburant:</span>
                        <span>{voiture.type_carburant}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Places:</span>
                        <span>{voiture.nombre_places}</span>
                      </div>
                    </div>
                    
                    {voiture.options.length > 0 && (
                      <div className="card-options">
                        <h3 className="options-title">Options</h3>
                        <ul className="options-list">
                          {voiture.options.map((opt, i) => (
                            <li key={i} className="option-item">{opt}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="card-actions">
                      <button 
                        onClick={() => openEditForm(voiture)} 
                        className="edit-button"
                      >
                        Modifier
                      </button>
                      <button 
                        onClick={() => handleDelete(voiture._id)} 
                        className="delete-button"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <style jsx>{`
          .voiture-list-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem 1rem;
          }
          
          .list-header {
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid #e2e8f0;
          }
          
          .list-title {
            font-size: 1.75rem;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 0.5rem;
          }
          
          .list-subtitle {
            font-size: 1rem;
            color: #718096;
            margin-bottom: 1.5rem;
          }
          
          .list-actions {
            display: flex;
            justify-content: flex-end;
          }
          
          .add-button {
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
          
          .add-button:hover {
            background-color: #3182ce;
          }
          
          .form-modal {
            margin-bottom: 2rem;
          }
          
          /* Loading State */
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
          
          /* Empty State */
          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 3rem;
            gap: 1.5rem;
            background-color: #f8fafc;
            border-radius: 8px;
            border: 1px dashed #cbd5e0;
          }
          
          .empty-state p {
            font-size: 1.125rem;
            color: #4a5568;
          }
          
          /* Voiture Grid */
          .voiture-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
          }
          
          /* Voiture Card */
          .voiture-card {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          
          .voiture-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
          }
          
          .card-image-container {
            height: 200px;
            position: relative;
            overflow: hidden;
          }
          
          .card-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }
          
          .voiture-card:hover .card-image {
            transform: scale(1.05);
          }
          
          .card-image-placeholder {
            width: 100%;
            height: 100%;
            background-color: #edf2f7;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #a0aec0;
          }
          
          .placeholder-image {
            object-fit: contain;
            padding: 1rem;
            background-color: #f8fafc;
          }
          
          .card-content {
            padding: 1.5rem;
          }
          
          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
          }
          
          .card-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #2d3748;
            margin: 0;
          }
          
          .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
          }
          
          .card-details {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
            margin-bottom: 1.5rem;
          }
          
          .detail-item {
            display: flex;
            flex-direction: column;
          }
          
          .detail-label {
            font-size: 0.75rem;
            color: #718096;
            margin-bottom: 0.25rem;
          }
          
          .price {
            font-weight: 600;
            color: #2d3748;
          }
          
          .card-options {
            margin-bottom: 1.5rem;
          }
          
          .options-title {
            font-size: 0.875rem;
            font-weight: 600;
            color: #4a5568;
            margin-bottom: 0.5rem;
          }
          
          .options-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            list-style: none;
            padding: 0;
            margin: 0;
          }
          
          .option-item {
            font-size: 0.75rem;
            padding: 0.25rem 0.5rem;
            background-color: #ebf8ff;
            color: #3182ce;
            border-radius: 4px;
          }
          
          .card-actions {
            display: flex;
            justify-content: space-between;
            gap: 0.75rem;
          }
          
          .edit-button {
            flex: 1;
            padding: 0.5rem;
            background-color: #edf2f7;
            color: #4a5568;
            border: none;
            border-radius: 4px;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s ease;
          }
          
          .edit-button:hover {
            background-color: #e2e8f0;
          }
          
          .delete-button {
            flex: 1;
            padding: 0.5rem;
            background-color: #fff5f5;
            color: #e53e3e;
            border: none;
            border-radius: 4px;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s ease;
          }
          
          .delete-button:hover {
            background-color: #fed7d7;
          }
        `}</style>
      </div>
    </AdminLayout>
  );
};

export default VoitureList;