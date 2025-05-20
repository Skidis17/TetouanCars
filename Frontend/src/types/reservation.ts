import { ReactNode } from 'react';

export type PaymentMethod = 'carte' | 'en especes' | 'par cheque';
export type PaymentStatus = 'payee' | 'non payee';
export type ReservationStatus = 'en_attente' | 'acceptee' | 'refusee' | 'reservee';

export interface Payment {
  methode: PaymentMethod;
  statut: PaymentStatus;
  date_paiement?: string;
}

export interface Reservation {
  _id: string;
  client_id: string;
  voiture_id: string;
  manager_traiteur_id: string;
  manager_createur_id: string;
  date_debut: string;
  date_fin: string;
  prix_total: number;
  statut: ReservationStatus;
  date_reservation: string;
  paiement: Payment | null;
}

export interface ReservationEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  extendedProps: {
    reservation: Reservation;
  };
}

export interface FilterOptions {
  status: ReservationStatus | 'all';
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  searchTerm: string;
}