import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Car as CarType } from "@/types/car";
import { Car as CarIcon, Users, Battery, Fuel, Calendar, Key } from "lucide-react";

interface CarCardProps {
  car: CarType;
}

const CarCard = ({ car }: CarCardProps) => {
  const getFuelTypeIcon = () => {
    switch (car.fuelType) {
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

  const getFuelTypeName = () => {
    switch (car.fuelType) {
      case "electric":
        return "Électrique";
      case "hybrid":
        return "Hybride";
      case "essence":
        return "Essence";
      default:
        return "Inconnu";
    }
  };

  return (
    <Link to={`/cars/${car.id}`} className="block">
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover-scale car-shadow transition-all">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={car.image} 
            alt={`${car.marque} ${car.model}`} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
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
              Permis {car.permitType}
            </Badge>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900">{car.marque} {car.model}</h3>
            <span className="font-bold text-carRental-primary">{car.prixJour}€<span className="text-sm font-normal text-gray-500">/jour</span></span>
          </div>
          
          <p className="text-gray-500 mb-4">{car.type}</p>
          
          {car.status === "occupee" && car.occupancyDates && (
            <div className="mb-4 p-2 bg-red-50 border border-red-100 rounded-md text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-red-500" />
                <span className="text-red-700">
                  Occupée jusqu'au {new Date(car.occupancyDates.to).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">{car.nombrePlaces} Places</span>
            </div>
            <div className="flex items-center space-x-2">
              <CarIcon className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">{car.kilometrage} km</span>
            </div>
            <div className="flex items-center space-x-2">
              {getFuelTypeIcon()}
              <span className="text-gray-600">{getFuelTypeName()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: car.couleur }}></div>
              <span className="text-gray-600 capitalize">{car.couleur}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              Ajoutée le {new Date(car.dateAjout).toLocaleDateString()}
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

export default CarCard;
