
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Car, mockCars, mockManagers } from "@/types/car";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarSpecification from "@/components/CarSpecification";
import ReservationContact from "@/components/ReservationContact";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Calendar, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const CarDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const foundCar = mockCars.find(c => c.id === id);
      setCar(foundCar || null);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleReservationCheck = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      toast.error("Veuillez sélectionner les dates de réservation");
      return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      toast.error("La date de fin doit être postérieure à la date de début");
      return;
    }
    
    if (car?.status === "occupee") {
      if (car.occupancyDates) {
        const occupiedFrom = new Date(car.occupancyDates.from);
        const occupiedTo = new Date(car.occupancyDates.to);
        toast.error(`Ce véhicule est occupé du ${occupiedFrom.toLocaleDateString()} au ${occupiedTo.toLocaleDateString()}`);
      } else {
        toast.error("Ce véhicule n'est pas disponible pour le moment");
      }
      return;
    }
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalPrice = car ? car.prixJour * diffDays : 0;
    
    toast.success(`Réservation possible pour ${diffDays} jours. Coût total estimé: ${totalPrice}€`);
  };

  // Get a manager based on car ID - alternating between the two managers
  const getManager = (carId: string) => {
    const managerId = parseInt(carId) % 2;
    return mockManagers[managerId];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Véhicule non trouvé</h1>
            <p className="text-gray-600 mb-6">Le véhicule que vous recherchez n'existe pas ou a été retiré.</p>
            <Button asChild className="bg-carRental-primary hover:bg-carRental-secondary">
              <Link to="/cars">Retour aux véhicules</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link to="/cars" className="inline-flex items-center text-carRental-primary hover:text-carRental-secondary">
              <ChevronLeft className="h-5 w-5" />
              <span>Retour aux véhicules</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-8">
                <img 
                  src={car.image} 
                  alt={`${car.marque} ${car.model}`} 
                  className="w-full h-80 object-cover"
                />
              </div>
              
              <CarSpecification car={car} />
              
              <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-6">Vérifier la disponibilité</h3>
                {car.status === "occupee" && car.occupancyDates && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-red-700">Véhicule occupé</p>
                      <p className="text-sm text-red-600">
                        Ce véhicule est déjà réservé du {new Date(car.occupancyDates.from).toLocaleDateString()} 
                        au {new Date(car.occupancyDates.to).toLocaleDateString()}.
                      </p>
                    </div>
                  </div>
                )}
                <form onSubmit={handleReservationCheck} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Date de début</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="date"
                          className="pl-10 w-full rounded-md border border-gray-300 py-3 px-4 focus:border-carRental-primary focus:ring-2 focus:ring-carRental-primary/20 focus:outline-none"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Date de fin</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="date"
                          className="pl-10 w-full rounded-md border border-gray-300 py-3 px-4 focus:border-carRental-primary focus:ring-2 focus:ring-carRental-primary/20 focus:outline-none"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          min={startDate || new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full bg-carRental-primary hover:bg-carRental-secondary"
                  >
                    Vérifier la disponibilité
                  </Button>
                </form>
                
                <Separator className="my-6" />
                
                <div className="bg-carRental-light p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Informations de prix</h4>
                  <div className="flex justify-between mb-2">
                    <span>Prix journalier:</span>
                    <span className="font-semibold">{car.prixJour}€ / jour</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    * Des frais supplémentaires peuvent s'appliquer selon la durée et les options choisies.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <ReservationContact manager={getManager(car.id)} carId={car.id} />
              
              <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-4">Informations importantes</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-2">
                    <span className="h-2 w-2 rounded-full bg-carRental-primary mt-2"></span>
                    <span className="text-gray-700">Une caution sera demandée lors de la prise du véhicule</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="h-2 w-2 rounded-full bg-carRental-primary mt-2"></span>
                    <span className="text-gray-700">Vous devez présenter un permis de conduire {car.permitType} valide</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="h-2 w-2 rounded-full bg-carRental-primary mt-2"></span>
                    <span className="text-gray-700">L'âge minimum requis est de 21 ans</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="h-2 w-2 rounded-full bg-carRental-primary mt-2"></span>
                    <span className="text-gray-700">Le carburant n'est pas inclus dans le prix de location</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-8 bg-carRental-light rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Vous avez des questions?</h3>
                <p className="text-gray-700 mb-4">
                  Notre équipe est disponible pour répondre à toutes vos questions concernant la location de ce véhicule.
                </p>
                <Button 
                  onClick={() => window.location.href = `tel:${getManager(car.id).phoneNumber}`}
                  variant="outline" 
                  className="w-full border-carRental-primary text-carRental-primary hover:bg-carRental-primary hover:text-white"
                >
                  Nous contacter
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CarDetails;
