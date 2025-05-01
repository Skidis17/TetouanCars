import { ChangeEvent, useState } from "react";
import { Voiture } from "../../types";

const CARBURANT_TYPES = ["Essence", "Diesel", "Hybride", "Electrique", "GPL"];
const STATUS_OPTIONS = ["disponible", "reservee", "maintenance", "hors_service"];
const CAR_OPTIONS = [
  "GPS",
  "Climatisation",
  "Bluetooth",
  "Caméra de recul",
  "Sièges chauffants",
  "Toit ouvrant",
  "Régulateur de vitesse",
  "Aide au stationnement"
];

interface VoitureFormProps {
  initialData: Omit<Voiture, '_id'>;
  editingVoiture: Voiture | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}

const VoitureForm = ({ initialData, editingVoiture, onSubmit, onCancel }: VoitureFormProps) => {
  const [formData, setFormData] = useState(initialData);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customOption, setCustomOption] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>(initialData.options);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.marque.trim()) newErrors.marque = "Marque obligatoire";
    if (!formData.modele.trim()) newErrors.modele = "Modèle obligatoire";
    if (formData.annee < 1990 || formData.annee > new Date().getFullYear() + 1) 
      newErrors.annee = "Année invalide";
    if (!formData.immatriculation.match(/^[A-Z0-9-]{2,15}$/)) 
      newErrors.immatriculation = "Immatriculation invalide";
    if (formData.kilometrage < 0) 
      newErrors.kilometrage = "Kilométrage invalide";
    if (formData.prix_journalier < 0) 
      newErrors.prix_journalier = "Prix invalide";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleAddOption = () => {
    if (customOption && !selectedOptions.includes(customOption)) {
      const newOptions = [...selectedOptions, customOption];
      setSelectedOptions(newOptions);
      setCustomOption('');
    }
  };

  const handleToggleOption = (option: string) => {
    const newOptions = selectedOptions.includes(option)
      ? selectedOptions.filter(opt => opt !== option)
      : [...selectedOptions, option];
    
    setSelectedOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const form = new FormData();
    
    // Ajouter tous les champs sauf options
    form.append('marque', formData.marque);
    form.append('modele', formData.modele);
    form.append('annee', formData.annee.toString());
    form.append('immatriculation', formData.immatriculation);
    form.append('couleur', formData.couleur);
    form.append('kilometrage', formData.kilometrage.toString());
    form.append('prix_journalier', formData.prix_journalier.toString());
    form.append('status', formData.status);
    form.append('type_carburant', formData.type_carburant);
    form.append('nombre_places', formData.nombre_places.toString());

    // Ajouter chaque option séparément
    selectedOptions.forEach(option => {
      form.append('options', option);
    });

    if (selectedImage) {
      form.append("image", selectedImage);
    }

    await onSubmit(form);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="voiture-form">
        <h2 className="form-title">
          {editingVoiture ? "Modifier la Voiture" : "Ajouter une Nouvelle Voiture"}
        </h2>
        
        <div className="form-grid">
          {/* Champ Marque */}
          <div className="form-group">
            <label className="form-label">Marque*</label>
            <input
              type="text"
              name="marque"
              value={formData.marque}
              onChange={handleInputChange}
              className={`form-input ${errors.marque ? 'input-error' : ''}`}
            />
            {errors.marque && <p className="error-message">{errors.marque}</p>}
          </div>

          {/* Champ Modèle */}
          <div className="form-group">
            <label className="form-label">Modèle*</label>
            <input
              type="text"
              name="modele"
              value={formData.modele}
              onChange={handleInputChange}
              className={`form-input ${errors.modele ? 'input-error' : ''}`}
            />
            {errors.modele && <p className="error-message">{errors.modele}</p>}
          </div>

          {/* Champ Année */}
          <div className="form-group">
            <label className="form-label">Année*</label>
            <input
              type="number"
              name="annee"
              value={formData.annee}
              onChange={handleInputChange}
              className={`form-input ${errors.annee ? 'input-error' : ''}`}
            />
            {errors.annee && <p className="error-message">{errors.annee}</p>}
          </div>

          {/* Champ Immatriculation */}
          <div className="form-group">
            <label className="form-label">Immatriculation*</label>
            <input
              type="text"
              name="immatriculation"
              value={formData.immatriculation}
              onChange={handleInputChange}
              className={`form-input ${errors.immatriculation ? 'input-error' : ''}`}
              disabled={!!editingVoiture}
            />
            {errors.immatriculation && <p className="error-message">{errors.immatriculation}</p>}
          </div>

          {/* Champ Couleur */}
          <div className="form-group">
            <label className="form-label">Couleur*</label>
            <input
              type="text"
              name="couleur"
              value={formData.couleur}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          {/* Champ Kilométrage */}
          <div className="form-group">
            <label className="form-label">Kilométrage*</label>
            <input
              type="number"
              name="kilometrage"
              value={formData.kilometrage}
              onChange={handleInputChange}
              className={`form-input ${errors.kilometrage ? 'input-error' : ''}`}
            />
            {errors.kilometrage && <p className="error-message">{errors.kilometrage}</p>}
          </div>

          {/* Champ Prix Journalier */}
          <div className="form-group">
            <label className="form-label">Prix Journalier (MAD)*</label>
            <input
              type="number"
              step="0.01"
              name="prix_journalier"
              value={formData.prix_journalier}
              onChange={handleInputChange}
              className={`form-input ${errors.prix_journalier ? 'input-error' : ''}`}
            />
            {errors.prix_journalier && <p className="error-message">{errors.prix_journalier}</p>}
          </div>

          {/* Champ Statut */}
          <div className="form-group">
            <label className="form-label">Statut*</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="form-input"
            >
              {STATUS_OPTIONS.map(option => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Champ Type de Carburant */}
          <div className="form-group">
            <label className="form-label">Type de Carburant*</label>
            <select
              name="type_carburant"
              value={formData.type_carburant}
              onChange={handleInputChange}
              className="form-input"
            >
              {CARBURANT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Champ Nombre de Places */}
          <div className="form-group">
            <label className="form-label">Nombre de Places*</label>
            <input
              type="number"
              name="nombre_places"
              value={formData.nombre_places}
              onChange={handleInputChange}
              min="1"
              max="9"
              className="form-input"
            />
          </div>

          {/* Champ Options */}
          <div className="form-group full-width">
            <label className="form-label">Options</label>
            
            <div className="option-add-container">
              <input
                type="text"
                value={customOption}
                onChange={(e) => setCustomOption(e.target.value)}
                placeholder="Nouvelle option"
                className="option-input"
              />
              <button
                type="button"
                onClick={handleAddOption}
                className="add-option-button"
              >
                Ajouter
              </button>
            </div>

            <div className="options-grid">
              {CAR_OPTIONS.map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleToggleOption(option)}
                  className={`option-button ${
                    selectedOptions.includes(option) ? 'option-selected' : ''
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="selected-options-container">
              {selectedOptions.length > 0 ? (
                <div className="selected-options-list">
                  {selectedOptions.map(option => (
                    <div key={option} className="selected-option">
                      {option}
                      <button
                        type="button"
                        onClick={() => handleToggleOption(option)}
                        className="remove-option-button"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-options-message">Aucune option sélectionnée</p>
              )}
            </div>
          </div>

          {/* Champ Image */}
          <div className="form-group full-width">
            <label className="form-label">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            {selectedImage && (
              <p className="file-selected-message">
                Fichier sélectionné: {selectedImage.name}
              </p>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={onCancel} 
            className="cancel-button"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className="submit-button"
          >
            {editingVoiture ? "Mettre à Jour" : "Ajouter la Voiture"}
          </button>
        </div>
      </form>

      <style jsx>{`
        .form-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        .voiture-form {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          padding: 2rem;
        }
        
        .form-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f0f2f5;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        .full-width {
          grid-column: 1 / -1;
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
          font-size: 0.9375rem;
          transition: all 0.2s ease;
          background-color: #f8fafc;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
          background-color: #ffffff;
        }
        
        .input-error {
          border-color: #e53e3e;
        }
        
        .error-message {
          color: #e53e3e;
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }
        
        /* Options Styles */
        .option-add-container {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        
        .option-input {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 0.875rem;
        }
        
        .add-option-button {
          padding: 0.75rem 1.25rem;
          background-color: #4299e1;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .add-option-button:hover {
          background-color: #3182ce;
        }
        
        .options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        
        .option-button {
          padding: 0.5rem 0.75rem;
          background-color: #edf2f7;
          border: none;
          border-radius: 6px;
          font-size: 0.8125rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }
        
        .option-button:hover {
          background-color: #e2e8f0;
        }
        
        .option-selected {
          background-color: #4299e1;
          color: white;
        }
        
        .option-selected:hover {
          background-color: #3182ce;
        }
        
        .selected-options-container {
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 1rem;
          min-height: 3.5rem;
        }
        
        .selected-options-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .selected-option {
          display: flex;
          align-items: center;
          padding: 0.375rem 0.75rem;
          background-color: #ebf8ff;
          border-radius: 20px;
          font-size: 0.8125rem;
        }
        
        .remove-option-button {
          margin-left: 0.5rem;
          background: none;
          border: none;
          color: #4299e1;
          cursor: pointer;
          font-size: 1rem;
          line-height: 1;
        }
        
        .no-options-message {
          color: #a0aec0;
          font-size: 0.875rem;
          text-align: center;
          margin: 0.5rem 0;
        }
        
        /* File Input */
        .file-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 0.875rem;
        }
        
        .file-selected-message {
          font-size: 0.8125rem;
          color: #4a5568;
          margin-top: 0.5rem;
        }
        
        /* Form Actions */
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding-top: 1.5rem;
          border-top: 1px solid #f0f2f5;
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
          transition: all 0.2s ease;
        }
        
        .cancel-button:hover {
          background-color: #f8fafc;
          border-color: #cbd5e0;
        }
        
        .submit-button {
          padding: 0.75rem 1.5rem;
          background-color: #4299e1;
          border: none;
          border-radius: 6px;
          font-size: 0.9375rem;
          font-weight: 500;
          color: white;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .submit-button:hover {
          background-color: #3182ce;
        }
      `}</style>
    </div>
  );
};

export default VoitureForm;