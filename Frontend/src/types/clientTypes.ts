// src/types/clientTypes.ts
export interface Address {
    rue: string;
    ville: string;
    code_postal: string;
    pays?: string;
  }
  
  export interface Client {
    _id: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: Address;
    permis_conduire: string;
    date_ajout: string | Date;
    reservations?: string[]; // IDs des réservations
  }