import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { Reservation } from '../../types/reservation';
import styles from './ReservationDetails.module.css';

interface ReservationDetailsProps {
    reservation: Reservation;
  open: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}

const ReservationDetails: React.FC<ReservationDetailsProps> = ({
  reservation,
  open,
  onClose,
  onStatusChange,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "en_attente": return styles.statusPending;
      case "acceptee": return styles.statusAccepted;
      case "refusee": return styles.statusRejected;
      case "annulee": return styles.statusCancelled;
      case "terminee": return styles.statusCompleted;
      default: return '';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className={styles.dialogContent}>
          <div className={styles.dialogHeader}>
            <Dialog.Title className={styles.dialogTitle}>
              Détails de la réservation
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Informations générales</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>ID Réservation</div>
                <div className={styles.infoValue}>{reservation._id}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Statut</div>
                <div className={`${styles.statusBadge} ${getStatusColor(reservation.statut)}`}>
                  {getStatusLabel(reservation.statut)}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Client</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Nom</div>
                <div className={styles.infoValue}>
                  {typeof reservation.client_id === 'object' 
                    ? `${reservation.client_id.prenom} ${reservation.client_id.nom}`
                    : 'Client non disponible'}
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Email</div>
                <div className={styles.infoValue}>
                  {typeof reservation.client_id === 'object' 
                    ? reservation.client_id.email
                    : 'Email non disponible'}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Véhicule</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Modèle</div>
                <div className={styles.infoValue}>
                  {typeof reservation.voiture_id === 'object'
                    ? `${reservation.voiture_id.marque} ${reservation.voiture_id.modele}`
                    : 'Véhicule non disponible'}
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Immatriculation</div>
                <div className={styles.infoValue}>
                  {typeof reservation.voiture_id === 'object'
                    ? reservation.voiture_id.immatriculation
                    : 'Immatriculation non disponible'}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Période de location</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Date de début</div>
                <div className={styles.infoValue}>{formatDate(reservation.date_debut)}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Date de fin</div>
                <div className={styles.infoValue}>{formatDate(reservation.date_fin)}</div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Managers</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Manager créateur</div>
                <div className={styles.infoValue}>
                  {typeof reservation.manager_createur_id === 'object'
                    ? `${reservation.manager_createur_id.prenom} ${reservation.manager_createur_id.nom}`
                    : 'Manager non disponible'}
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Manager traiteur</div>
                <div className={styles.infoValue}>
                  {typeof reservation.manager_traiteur_id === 'object'
                    ? `${reservation.manager_traiteur_id.prenom} ${reservation.manager_traiteur_id.nom}`
                    : 'Manager non disponible'}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Fermer
            </button>
            {reservation.statut === 'en_attente' && (
              <>
                <button
                  onClick={() => onStatusChange(reservation._id, 'acceptee')}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  Accepter
                </button>
                <button
                  onClick={() => onStatusChange(reservation._id, 'refusee')}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Refuser
                </button>
              </>
            )}
          </div>
        </div>
    </div>
    </Dialog>
  );
};

export default ReservationDetails;