import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CarCard from "./CarCard"; 
import { type_carburant } from "@/types/car";
import { Car as Car } from "@/types/car";
import axios from "axios";

const FeaturedCars = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [error, setError] = useState<string>("");

  const carburantMapping: { [key: string]: type_carburant } = {
    electric: "Electrique",
    hybrid: "Hybride",
    essence: "Essence"
  };
  
  // fetch d api hnaya by axios
  useEffect(() => {
    axios
      .get("http://localhost:5000/")
      .then((response) => {
        const availableCars = response.data.filter((car: Car) => car.status === "disponible");// ba9i khasni nhayda hitach deja li f bd homa li dispo
  
        if (activeTab === "all") {
          setFilteredCars(availableCars.slice(0, 3)); //kanfetchiw 3 mn ba3d kan9olo chof les voiture kamlin
        } else {
          setFilteredCars(
            availableCars
              .filter((car) => car.type_carburant === carburantMapping[activeTab])
              .slice(0, 3)// f filtre essence electrique hybrid ghaybano gha 3
          );
        }
      })
      .catch((err) => {
        setError("Error fetching cars: " + err.message);
      });
  }, [activeTab]);
  

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Nos Véhicules Populaires</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez notre sélection de véhicules les plus demandés, soigneusement entretenus pour votre confort et votre sécurité
          </p>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <div className="flex justify-center">
            <TabsList className="bg-gray-100">
              <TabsTrigger value="all" className="data-[state=active]:bg-carRental-primary data-[state=active]:text-white">
                Tous
              </TabsTrigger>
              <TabsTrigger value="electric" className="data-[state=active]:bg-carRental-primary data-[state=active]:text-white">
                Électriques
              </TabsTrigger>
              <TabsTrigger value="hybrid" className="data-[state=active]:bg-carRental-primary data-[state=active]:text-white">
                Hybrides
              </TabsTrigger>
              <TabsTrigger value="essence" className="data-[state=active]:bg-carRental-primary data-[state=active]:text-white">
                Essence
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild className="bg-carRental-primary hover:bg-carRental-secondary">
            <Link to="/cars">Voir tous les véhicules</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;