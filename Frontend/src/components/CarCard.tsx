import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Car } from "@/types/car";
import { Car as CarIcon, Users, Battery, Fuel, Calendar } from "lucide-react";

// Add this interface to define props for the card component
interface CarCardProps {
  car: Car;
}

// This is your card component that takes car as a prop
const CarCardComponent = ({ car }: CarCardProps) => {
  const getFuelTypeIcon = (fuelType: string) => {
    switch (fuelType) {
      case "electric":
        return <Battery className="h-5 w-5" />;
      case "hybrid":
        return <Fuel className="h-5 w-5" />;
      case "essence":
        return <Fuel className="h-5 w-5" />;
      default:
        return <Fuel className="h-5 w-5" />;
    }
  };

  const getFuelTypeName = (FuelType: string) => {
    switch (FuelType) {
      case "electric":
        return "Électrique";
      case "Hybride":
        return "Hybride";
      case "Essence":
        return "Essence";
      default:
        return "Inconnu";
    }
  };
  
  // const getPermit = (permitType: string) => {
  //   switch (permitType) {
  //     case "B":
  //       return "B";
  //     case "C":
  //       return "C";
  //     case "D":
  //       return "D";
  //     default:
  //       return "Inconnu";
  //   }
  // };

  return (
    <Link to={`/cars/${car._id}`} className="block">
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover-scale car-shadow transition-all">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={car.image}
            alt={`${car.marque} ${car.model}`} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
                      console.log(car.image);

          <div className="absolute top-4 right-4">
            <Badge className={car.status === "disponible" 
              ? "bg-green-500 hover:bg-green-600" 
              : "bg-red-500 hover:bg-red-600"
            }>
              {car.status === "disponible" ? "Disponible" : "Occupée"}
            </Badge>
          </div>
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-carRental-primary hover:bg-carRental-secondary">
              Permis {car.Permis}
            </Badge>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900">{car.marque} {car.model}</h3>
            <span className="font-bold text-carRental-primary">{car.prix_journalier}MAD<span className="text-sm font-normal text-gray-500">/jour</span></span>
          </div>
          
          <p className="text-gray-500 mb-4">{car.type}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">{car.nombre_places} Places</span>
            </div>
            <div className="flex items-center space-x-2">
              <CarIcon className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">{car.kilometrage} km</span>
            </div>
            <div className="flex items-center space-x-2">
              {getFuelTypeIcon(car.type_carburant)}
              <span className="text-gray-600">{getFuelTypeName(car.type_carburant)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: car.couleur }}></div>
              <span className="text-gray-600 capitalize">{car.couleur}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              {car.date_ajout ? (
                new Date(car.date_ajout).toLocaleDateString('fr-FR')
              ) : (
                "Date non disponible"
              )}
            </div>
            <div className="text-carRental-primary font-medium text-sm">
              Voir détails →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Rest in peace, CarCards. You fetched cars when nobody asked you to. 
// const CarCards = () => {
//   const [cars, setCars] = useState<Car[]>([]);
//   const [error, setError] = useState<string>("");

//   useEffect(() => {
//     axios.get("http://localhost:5000/")
//       .then((response) => {
//         setCars(response.data); 
//       })
//       .catch((err) => {
//         setError("Error fetching cars: " + err.message);
//       });
//   }, []);

//   return (
//     <div>
//       {error && <p>{error}</p>}
//       <div className="car-cards">
//         {cars.map((car) => (
//           <CarCardComponent key={car._id} car={car} />
//         ))}
//       </div>
//     </div>
//   );
// };

export default CarCardComponent;