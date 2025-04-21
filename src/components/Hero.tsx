
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Car, MapPin } from "lucide-react";

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-carRental-dark to-carRental-primary">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

      <div className="container mx-auto px-4 z-10 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Trouvez la voiture de vos rêves pour votre prochain voyage
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Une large gamme de véhicules pour tous vos besoins. Obtenez des prix avantageux et un service exceptionnel.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-white text-carRental-primary hover:bg-gray-100">
                <Link to="/cars">Voir nos voitures</Link>
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 mt-10 lg:mt-0">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Réservez une voiture</h2>
            <form className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Lieu de prise en charge</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    className="pl-10 w-full rounded-md border border-gray-300 py-3 px-4 focus:border-carRental-primary focus:ring-2 focus:ring-carRental-primary/20 focus:outline-none"
                    placeholder="Sélectionner le lieu"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Date de départ</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="date"
                      className="pl-10 w-full rounded-md border border-gray-300 py-3 px-4 focus:border-carRental-primary focus:ring-2 focus:ring-carRental-primary/20 focus:outline-none"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Date de retour</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="date"
                      className="pl-10 w-full rounded-md border border-gray-300 py-3 px-4 focus:border-carRental-primary focus:ring-2 focus:ring-carRental-primary/20 focus:outline-none"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Type de véhicule</label>
                <div className="relative">
                  <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select className="pl-10 w-full rounded-md border border-gray-300 py-3 px-4 focus:border-carRental-primary focus:ring-2 focus:ring-carRental-primary/20 focus:outline-none appearance-none bg-white">
                    <option value="">Tous les types</option>
                    <option value="SUV">SUV</option>
                    <option value="Berline">Berline</option>
                    <option value="Citadine">Citadine</option>
                  </select>
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-carRental-primary hover:bg-carRental-secondary" size="lg">
                Rechercher
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
