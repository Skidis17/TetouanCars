import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Car, mockManagers } from "@/types/car";
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
  const [cars, setCars] = useState<Car[]>([]);
  const [currentCar, setCurrentCar] = useState<Car | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllCars = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/");
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("Invalid data format received from server");
        }

        setCars(response.data);
        
        // Find the specific car by ID hia li3t9tna fr fr 
        const foundCar = response.data.find(car => car._id === id);
        if (foundCar) {
          setCurrentCar(foundCar);
        } else {
          setError("Véhicule non trouvé");
        }
      } catch (err) {
        setError(err.response?.data?.error || "Erreur lors du chargement des véhicules");
        toast.error("Erreur de chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchAllCars();
  }, [id]);

  // const handleReservationCheck = (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   // if (!startDate || !endDate) {
  //   //   toast.error("Veuillez sélectionner les dates de réservation");
  //   //   return;
  //   // }
    
  //   // const start = new Date(startDate);
  //   // const end = new Date(endDate);
    
  //   // if (start >= end) {
  //   //   toast.error("La date de fin doit être postérieure à la date de début");
  //   //   return;
  //   // }

  //   // if (currentCar?.status === "occupee") {
  //   //   toast.error("Ce véhicule n'est pas disponible pour le moment");
  //   //   return;
  //   // }
    
  //   // const diffTime = Math.abs(end.getTime() - start.getTime());
  //   // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //   // const totalPrice = currentCar ? currentCar.prix_journalier * diffDays : 0;
    
  //   // toast.success(`Réservation possible pour ${diffDays} jours. Coût total estimé: ${totalPrice}MAD`);
  // };

  const getManager = (carId: string) => {
    const managerId = parseInt(carId) % mockManagers.length;
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

  if (error || !currentCar) {
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
                  src={currentCar.image} 
                  alt={`${currentCar.marque} ${currentCar.model}`} 
                  className="w-full h-90 object-cover"
                />
              </div>
              
              <CarSpecification car={currentCar} />
              
              {/*  */}
            </div>
            
            <div className="lg:col-span-1">
              <ReservationContact manager={getManager(currentCar._id)} carId={currentCar._id} />
              
              <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-4">Informations importantes</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-2">
                    <span className="h-2 w-2 rounded-full bg-carRental-primary mt-2"></span>
                    <span className="text-gray-700">Une caution sera demandée lors de la prise du véhicule</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="h-2 w-2 rounded-full bg-carRental-primary mt-2"></span>
                    <span className="text-gray-700">Vous devez présenter un permis de conduire {currentCar.Permis} valide</span>
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
                  onClick={() => window.location.href = `tel:${getManager(currentCar._id).phoneNumber}`}
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