export type FuelType = 'electric' | 'hybrid' | 'essence';
export type CarStatus = 'disponible' | 'occupee';
export type PermitType = 'B' | 'C' | 'D' | 'EB' | 'EC' | 'ED';

export interface Car {
  id: string;
  marque: string;
  model: string;
  type: string; 
  immatricule: string;
  couleur: string;
  kilometrage: number;
  prixJour: number;
  status: CarStatus;
  fuelType: FuelType;
  nombrePlaces: number;
  options: string[];
  dateAjout: string;
  image: string;
  permitType: PermitType;
  occupancyDates?: {
    from: string;
    to: string;
  };
}

export interface Manager {
  name: string;
  phoneNumber: string;
  email: string;
  location: string;
  image?: string;
}

// Updating mock data with 20 cars and proper image URLs
export const mockCars: Car[] = [
  {
    id: "1",
    marque: "BMW",
    model: "X5",
    type: "SUV",
    immatricule: "TU-5432-A",
    couleur: "Noir",
    kilometrage: 25000,
    prixJour: 120,
    status: "disponible",
    fuelType: "hybrid",
    nombrePlaces: 5,
    options: ["GPS", "Climatisation", "Bluetooth", "Caméra de recul"],
    dateAjout: "2023-10-15",
    image: "https://images.unsplash.com/photo-1506610654-064fbba4780c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    permitType: "B"
  },
  {
    id: "2",
    marque: "Mercedes",
    model: "Sprinter",
    type: "Van",
    immatricule: "TU-1234-C",
    couleur: "Blanc",
    kilometrage: 35000,
    prixJour: 150,
    status: "disponible",
    fuelType: "essence",
    nombrePlaces: 15,
    options: ["GPS", "Climatisation", "Bluetooth", "Caméra de recul"],
    dateAjout: "2024-01-20",
    image: "https://images.unsplash.com/photo-1464219789935-c2d9d9eb4b20?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    permitType: "D"
  },
    {
    id: "3",
    marque: "Toyota",
    model: "Corolla",
    type: "Sedan",
    immatricule: "TU-7890-E",
    couleur: "Bleu",
    kilometrage: 18000,
    prixJour: 75,
    status: "disponible",
    fuelType: "essence",
    nombrePlaces: 5,
    options: ["Climatisation", "Bluetooth", "Régulateur de vitesse"],
    dateAjout: "2024-02-01",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    permitType: "B"
  },
  {
    id: "4",
    marque: "Volkswagen",
    model: "Golf",
    type: "Hatchback",
    immatricule: "TU-5678-G",
    couleur: "Gris",
    kilometrage: 22000,
    prixJour: 80,
    status: "disponible",
    fuelType: "essence",
    nombrePlaces: 5,
    options: ["Climatisation", "Bluetooth", "Jantes alliage"],
    dateAjout: "2024-02-15",
    image: "https://images.unsplash.com/photo-1552519507-da3b4296e3cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    permitType: "B"
  },
  {
    id: "5",
    marque: "Ford",
    model: "Focus",
    type: "Hatchback",
    immatricule: "TU-8901-H",
    couleur: "Rouge",
    kilometrage: 19000,
    prixJour: 78,
    status: "disponible",
    fuelType: "essence",
    nombrePlaces: 5,
    options: ["Climatisation", "Bluetooth", "Régulateur de vitesse"],
    dateAjout: "2024-03-01",
    image: "https://images.unsplash.com/photo-1542309378-5433c45c6c10?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    permitType: "B"
  },
  {
    id: "6",
    marque: "Nissan",
    model: "Qashqai",
    type: "SUV",
    immatricule: "TU-2345-I",
    couleur: "Blanc",
    kilometrage: 28000,
    prixJour: 110,
    status: "disponible",
    fuelType: "essence",
    nombrePlaces: 5,
    options: ["GPS", "Climatisation", "Bluetooth", "Caméra de recul"],
    dateAjout: "2024-03-15",
    image: "https://images.unsplash.com/photo-1591474202009-8a935a754924?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    permitType: "B"
  },
  {
    id: "7",
    marque: "Peugeot",
    model: "308",
    type: "Hatchback",
    immatricule: "TU-6789-J",
    couleur: "Gris",
    kilometrage: 17000,
    prixJour: 77,
    status: "disponible",
    fuelType: "essence",
    nombrePlaces: 5,
    options: ["Climatisation", "Bluetooth", "Toit panoramique"],
    dateAjout: "2024-04-01",
    image: "https://images.unsplash.com/photo-1631899048494-19f79555191b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    permitType: "B"
  },
  {
    id: "8",
    marque: "Renault",
    model: "Clio",
    type: "Hatchback",
    immatricule: "TU-0123-K",
    couleur: "Bleu",
    kilometrage: 16000,
    prixJour: 72,
    status: "disponible",
    fuelType: "essence",
    nombrePlaces: 5,
    options: ["Climatisation", "Bluetooth", "Régulateur de vitesse"],
    dateAjout: "2024-04-15",
    image: "https://images.unsplash.com/photo-1624571199477-48899162f744?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    permitType: "B"
  },
  {
    id: "9",
    marque: "Fiat",
    model: "500",
    type: "Hatchback",
    immatricule: "TU-3456-L",
    couleur: "Blanc",
    kilometrage: 14000,
    prixJour: 68,
    status: "disponible",
    fuelType: "essence",
    nombrePlaces: 4,
    options: ["Climatisation", "Bluetooth", "Toit ouvrant"],
    dateAjout: "2024-05-01",
    image: "https://images.unsplash.com/photo-1605557014444-73ca56a35c54?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    permitType: "B"
  },
  {
    id: "10",
    marque: "Opel",
    model: "Astra",
    type: "Hatchback",
    immatricule: "TU-7890-M",
    couleur: "Gris",
    kilometrage: 21000,
    prixJour: 79,
    status: "disponible",
    fuelType: "essence",
    nombrePlaces: 5,
    options: ["Climatisation", "Bluetooth", "Régulateur de vitesse"],
    dateAjout: "2024-05-15",
    image: "https://images.unsplash.com/photo-1616482344448-4a5254084191?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    permitType: "B"
  },
  {
    id: "11",
    marque: "Audi",
    model: "A3",
    type: "Hatchback",
    immatricule: "TU-1234-N",
    couleur: "Noir",
    kilometrage: 23000,
    prixJour: 95,
    status: "disponible",
    fuelType: "essence",
    nombrePlaces: 5,
    options: ["Climatisation", "Bluetooth", "GPS", "Jantes alliage"],
    dateAjout: "2024-06-01",
    image: "https://images.unsplash.com/photo-1541443131804-55862244996a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    permitType: "B"
  },
  {
    id: "12",
    marque: "Mercedes",
    model: "Classe A",
    type: "Hatchback",
    immatricule: "TU-4567-O",
    couleur: "Blanc",
    kilometrage: 20000,
    prixJour: 98,
    status: "disponible",
    fuelType: "essence",
    nombrePlaces: 5,
    options: ["Climatisation", "Bluetooth", "GPS", "Sièges chauffants"],
    dateAjout: "2024-06-15",
    image: "https://images.unsplash.com/photo-1580274455119-651523638073?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    permitType: "B"
  },
  {
    id: "13",
    marque: "BMW",
    model: "Série 1",
    type: "Hatchback",
    immatricule: "TU-7890-P",
    couleur: "Gris",
    kilometrage: 24000,
    prixJour: 92,
    status: "disponible",
    fuelType: "essence",
    nombrePlaces: 5,
    options: ["Climatisation", "Bluetooth", "GPS", "Jantes alliage"],
    dateAjout: "2024-07-01",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    permitType: "B"
  },
  {
    id: "14",
    marque: "Skoda",
    model: "Octavia",
    type: "Sedan",
    immatricule: "TU-2345-Q",
    couleur: "Blanc",
    kilometrage: 19000,
    prixJour: 82,
    status: "disponible",
    fuelType: "essence",
    nombrePlaces: 5,
    options: ["Climatisation", "Bluetooth", "Régulateur de vitesse"],
    dateAjout: "2024-07-15",
    image: "https://images.unsplash.com/photo-1601942744539-43a91e75b148?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    permitType: "B"
  },
  {
    id: "15",
    marque: "Hyundai",
    model: "Tucson",
    type: "SUV",
    immatricule: "TU-5678-R",
    couleur: "Gris",
    kilometrage: 26000,
    prixJour: 105,
    status: "disponible",
    fuelType: "essence",
    nombrePlaces: 5,
    options: ["Climatisation", "Bluetooth", "Caméra de recul", "GPS"],
    dateAjout: "2024-08-01",
    image: "https://images.unsplash.com/photo-1616482344448-4a5254084191?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    permitType: "B"
  },
  {
    id: "16",
    marque: "Kia",
    model: "Sportage",
    type: "SUV",
    immatricule: "TU-8901-S",
    couleur: "Blanc",
    kilometrage: 27000,
    prixJour: 108,
    status: "disponible",
    fuelType: "essence",
    nombrePlaces: 5,
    options: ["Climatisation", "Bluetooth", "Caméra de recul", "GPS"],
    dateAjout: "2024-08-15",
    image: "https://images.unsplash.com/photo-1607882904234-c1903929f947?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    permitType: "B"
  },
  {
    id: "17",
    marque: "Dacia",
    model: "Duster",
    type: "SUV",
    immatricule: "TU-2345-T",
    couleur: "Gris",
    kilometrage: 30000,
    prixJour: 90,
    status: "disponible",
    fuelType: "essence",
    nombrePlaces: 5,
    options: ["Climatisation", "Régulateur de vitesse"],
    dateAjout: "2024-09-01",
    image: "https://images.unsplash.com/photo-1616482344448-4a5254084191?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    permitType: "B"
  },
  {
    id: "18",
    marque: "Citroen",
    model: "C3",
    type: "Hatchback",
    immatricule: "TU-5678-U",
    couleur: "Rouge",
    kilometrage: 15000,
    prixJour: 65,
    status: "disponible",
    fuelType: "essence",
    nombrePlaces: 5,
    options: ["Climatisation", "Bluetooth"],
    dateAjout: "2024-09-15",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    permitType: "B"
  },
  {
    id: "19",
    marque: "Suzuki",
    model: "Swift",
    type: "Hatchback",
    immatricule: "TU-8901-V",
    couleur: "Bleu",
    kilometrage: 18000,
    prixJour: 70,
    status: "disponible",
    fuelType: "essence",
    nombrePlaces: 5,
    options: ["Climatisation", "Bluetooth"],
    dateAjout: "2024-10-01",
    image: "https://images.unsplash.com/photo-1541443131804-55862244996a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    permitType: "B"
  },
  {
    id: "20",
    marque: "MG",
    model: "ZS EV",
    type: "SUV",
    immatricule: "TU-2345-W",
    couleur: "Blanc",
    kilometrage: 12000,
    prixJour: 130,
    status: "disponible",
    fuelType: "electric",
    nombrePlaces: 5,
    options: ["Climatisation", "Bluetooth", "Caméra de recul", "GPS"],
    dateAjout: "2024-10-15",
    image: "https://images.unsplash.com/photo-1616482344448-4a5254084191?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    permitType: "B"
  }
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
