export interface Voiture {
    _id: string;
    marque: string;
    modele: string;
    annee: number;
    immatriculation: string;
    couleur: string;
    kilometrage: number;
    prix_journalier: number;
    status: string;
    type_carburant: string;
    nombre_places: number;
    options: string[];
    date_ajout?: string;
    image_id?: string;
  }