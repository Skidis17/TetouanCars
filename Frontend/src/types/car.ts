export type type_carburant = 'Electrique' | 'Hybride' | 'Essence';
export type CarStatus = 'disponible' | 'occupee';
export type PermitType = 'B' | 'C' | 'D' | 'EB' | 'EC' | 'ED';

export interface Voiture {
  _id: string;
  marque: string;
  model: string;
  annee: number;
  immatriculation: string;
  couleur: string;
  kilometrage: number;
  prix_journalier: number;
  status: 'disponible' | 'reservee' | 'maintenance' | 'hors_service';
  type_carburant: string;
  nombre_places: number;
  options: string[];
  image_id?: string;
  date_ajout?: Date;
  date_modification?: Date;
}

export interface Manager {
  name: string;
  phoneNumber: string;
  email: string;
  location: string;
  image?: string;
}

// Updating mock data with 20 cars and proper image URLs
export const mockCars: Voiture[] = [
  
];

// Update managers with Moroccan details
export const mockManagers: Manager[] = [
  {
    name: "Chrayah Mohamed",
    phoneNumber: "+212 661-234-567",
    email: "mohamed.chrayah@tetouancars.com",
    location: "Tétouan, Maroc",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
  },
  {
    name: "Jaber Bouhdidi",
    phoneNumber: "+212 662-345-678",
    email: "jaber.bouhdidi@tetouancars.com",
    location: "Tétouan, Maroc",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
  }
];

// Replace the single mockManager with the first manager from the array
export const mockManager: Manager = mockManagers[0];
