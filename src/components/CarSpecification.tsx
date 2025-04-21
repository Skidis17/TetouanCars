import { Car } from "@/types/car";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Battery, Car as CarIcon, Fuel, Info, Users, Calendar, Key } from "lucide-react";

interface CarSpecificationProps {
  car: Car;
}

const CarSpecification = ({ car }: CarSpecificationProps) => {
  const getFuelTypeIcon = () => {
    switch (car.fuelType) {
      case "electric":
        return <Battery className="h-5 w-5 text-blue-500" />;
      case "hybrid":
        return <CarIcon className="h-5 w-5 text-green-500" />;
      case "essence":
        return <Fuel className="h-5 w-5 text-orange-500" />;
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

  const getPermitDescription = () => {
    switch (car.permitType) {
      case "B":
        return "Permis B (véhicules légers jusqu'à 3,5 tonnes)";
      case "C":
        return "Permis C (véhicules lourds de 3,5 à 7,5 tonnes)";
      case "D":
        return "Permis D (transport de passagers plus de 8 places)";
      case "EB":
        return "Permis EB (véhicules légers avec remorque)";
      case "EC":
        return "Permis EC (poids lourds avec remorque)";
      case "ED":
        return "Permis ED (autobus avec remorque)";
      default:
        return "Permis B (standard)";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{car.marque} {car.model}</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-carRental-light text-carRental-primary border-carRental-primary">
            {car.type}
          </Badge>
          <Badge className={car.status === "disponible" 
            ? "bg-green-500 hover:bg-green-600" 
            : "bg-red-500 hover:bg-red-600"
          }>
            {car.status === "disponible" ? "Disponible" : "Occupée"}
          </Badge>
          {car.status === "occupee" && car.occupancyDates && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
              Du {new Date(car.occupancyDates.from).toLocaleDateString()} au {new Date(car.occupancyDates.to).toLocaleDateString()}
            </Badge>
          )}
        </div>
      </div>

      <Separator />
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-12 w-12 rounded-full bg-carRental-light flex items-center justify-center">
            <Info className="h-6 w-6 text-carRental-primary" />
          </div>
          <span className="text-sm text-gray-500">Immatriculation</span>
          <span className="font-medium">{car.immatricule}</span>
        </div>
        
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-12 w-12 rounded-full bg-carRental-light flex items-center justify-center">
            <div className="h-6 w-6 rounded-full" style={{ backgroundColor: car.couleur.toLowerCase() }}></div>
          </div>
          <span className="text-sm text-gray-500">Couleur</span>
          <span className="font-medium">{car.couleur}</span>
        </div>

        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-12 w-12 rounded-full bg-carRental-light flex items-center justify-center">
            <CarIcon className="h-6 w-6 text-carRental-primary" />
          </div>
          <span className="text-sm text-gray-500">Kilométrage</span>
          <span className="font-medium">{car.kilometrage} km</span>
        </div>

        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-12 w-12 rounded-full bg-carRental-light flex items-center justify-center">
            {getFuelTypeIcon()}
          </div>
          <span className="text-sm text-gray-500">Type de carburant</span>
          <span className="font-medium">{getFuelTypeName()}</span>
        </div>

        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-12 w-12 rounded-full bg-carRental-light flex items-center justify-center">
            <Users className="h-6 w-6 text-carRental-primary" />
          </div>
          <span className="text-sm text-gray-500">Nombre de places</span>
          <span className="font-medium">{car.nombrePlaces}</span>
        </div>

        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-12 w-12 rounded-full bg-carRental-light flex items-center justify-center">
            <Calendar className="h-6 w-6 text-carRental-primary" />
          </div>
          <span className="text-sm text-gray-500">Date d'ajout</span>
          <span className="font-medium">{new Date(car.dateAjout).toLocaleDateString()}</span>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Permis requis</h3>
        <div className="bg-carRental-light p-4 rounded-lg">
          <div className="flex items-center space-x-3 mb-2">
            <Badge className="bg-carRental-primary">{car.permitType}</Badge>
            <span className="font-medium">{getPermitDescription()}</span>
          </div>
          <p className="text-sm text-gray-600">
            Vous devez posséder un permis valide de type {car.permitType} ou supérieur pour conduire ce véhicule.
          </p>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Options et équipements</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {car.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-carRental-light flex items-center justify-center">
                <Key className="h-4 w-4 text-carRental-primary" />
              </div>
              <span>{option}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarSpecification;
