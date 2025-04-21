
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import CarFilterSidebar from "@/components/CarFilterSidebar";
import { Car, mockCars } from "@/types/car";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const CarListings = () => {
  const [searchParams] = useSearchParams();
  const [filteredCars, setFilteredCars] = useState<Car[]>(mockCars);
  const [filterState, setFilterState] = useState({
    priceRange: [0, 200],
    types: [] as string[],
    fuelTypes: [] as string[],
    options: [] as string[]
  });

  useEffect(() => {
    // Apply URL parameters if they exist
    const typeParam = searchParams.get("type");
    const fuelTypeParam = searchParams.get("fuelType");
    
    if (typeParam) {
      setFilterState(prev => ({
        ...prev,
        types: [typeParam]
      }));
    }
    
    if (fuelTypeParam) {
      setFilterState(prev => ({
        ...prev,
        fuelTypes: [fuelTypeParam]
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    // Apply filters
    let result = mockCars;
    
    // Filter by price
    result = result.filter(car => 
      car.prixJour >= filterState.priceRange[0] && 
      car.prixJour <= filterState.priceRange[1]
    );
    
    // Filter by car type
    if (filterState.types.length > 0) {
      result = result.filter(car => filterState.types.includes(car.type));
    }
    
    // Filter by fuel type
    if (filterState.fuelTypes.length > 0) {
      result = result.filter(car => filterState.fuelTypes.includes(car.fuelType));
    }
    
    // Filter by options
    if (filterState.options.length > 0) {
      result = result.filter(car => 
        filterState.options.every(option => car.options.includes(option))
      );
    }
    
    setFilteredCars(result);
  }, [filterState]);

  const handleFilterChange = (filters: any) => {
    setFilterState(filters);
  };

  const clearFilters = () => {
    setFilterState({
      priceRange: [0, 200],
      types: [],
      fuelTypes: [],
      options: []
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
                  {filteredCars.length} véhicule{filteredCars.length !== 1 ? 's' : ''} trouvé{filteredCars.length !== 1 ? 's' : ''}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Trier par:</span>
                  <select className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:border-carRental-primary focus:ring-1 focus:ring-carRental-primary outline-none">
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
                    <CarCard key={car.id} car={car} />
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
