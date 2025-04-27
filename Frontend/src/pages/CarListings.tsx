import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Car } from "@/types/car";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import CarFilterSidebar from "@/components/CarFilterSidebar";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const CarListings = () => {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<string>("price-asc");
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [filterState, setFilterState] = useState({
    priceRange: [0, 10000],
    types: [] as string[],
    fuelTypes: [] as string[],
    options: [] as string[],
  });

  //fetch d api hnaya (normally we should have a centerlized file kay3ml fetch walakin gha than db)
  useEffect(() => {
    axios
      .get("http://localhost:5000/") 
      .then((response) => {
        setCars(response.data);  // Store the raw data f `cars` deja mdeclaria
      })
      .catch((error) => {
        console.error("Error fetching car data:", error);
      });
  }, []);

  useEffect(() => {
    // Apply filters whenever the filterState changes
    let result = [...cars];  // Start with the full list of cars

    // Apply filters
    result = result.filter((car) =>
      car.prix_journalier >= filterState.priceRange[0] &&
      car.prix_journalier <= filterState.priceRange[1]
    );

    if (filterState.types.length > 0) {
      result = result.filter((car) => filterState.types.includes(car.type));
    }

    if (filterState.fuelTypes.length > 0) {
      result = result.filter((car) => filterState.fuelTypes.includes(car.type_carburant));
    }

    if (filterState.options.length > 0) {
      result = result.filter((car) =>
        filterState.options.every((option) => car.options.includes(option))
      );
    }
    
    switch(sortBy) {
      case "price-asc":
        result.sort((a, b) => a.prix_journalier - b.prix_journalier);
        break;
      case "price-desc":
        result.sort((a, b) => b.prix_journalier - a.prix_journalier);
        break;
      case "newest":
        result.sort((a, b) => 
          new Date(b.date_ajout).getTime() - new Date(a.date_ajout).getTime()
        );
        break;
      case "oldest":
        result.sort((a, b) => 
          new Date(a.date_ajout).getTime() - new Date(b.date_ajout).getTime()
        );
        break;
      default:
        break;
    }

    setFilteredCars(result);  // Set the filtered list
  }, [filterState, cars, sortBy]);  // Trigger this effect whenever `filterState` or `cars` changes

  const handleFilterChange = (filters: any) => {
    setFilterState(filters);
  };

  const clearFilters = () => {
    setFilterState({
      priceRange: [0, 5000],
      types: [],
      fuelTypes: [],
      options: [],
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Nos Véhicules</h1>
            <p className="text-gray-600">Trouvez la voiture idéale pour votre prochain voyage</p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4">
              <div className="sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Filtres</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-carRental-primary hover:text-carRental-secondary"
                  >
                    Réinitialiser
                  </Button>
                </div>
                <Separator className="mb-6" />
                <CarFilterSidebar onFilterChange={handleFilterChange} />
              </div>
            </div>

            <div className="md:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-500">
                  {filteredCars.length} véhicule{filteredCars.length !== 1 ? "s" : ""} trouvé
                  {filteredCars.length !== 1 ? "s" : ""}
                </p>
              
              {/* hnaya filtres de prix w date */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Trier par:</span>
                <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:border-carRental-primary focus:ring-1 focus:ring-carRental-primary outline-none"
                  >
                  <option value="price-asc">Prix: croissant</option>
                  <option value="price-desc">Prix: décroissant</option>
                  <option value="newest">Plus récent</option>
                  <option value="oldest">Plus ancien</option>
                </select>
              </div>
              </div>

              {filteredCars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCars.map((car) => (
                    <CarCard key={car._id} car={car} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">Aucun véhicule trouvé</h3>
                  <p className="text-gray-600 mb-4">
                    Aucun véhicule ne correspond à vos critères de recherche.
                  </p>
                  <Button onClick={clearFilters} className="bg-carRental-primary hover:bg-carRental-secondary">
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CarListings;
