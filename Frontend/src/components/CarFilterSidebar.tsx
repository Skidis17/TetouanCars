import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Battery, Car, Fuel } from "lucide-react";

interface CarFilterSidebarProps {
  onFilterChange: (filters: any) => void;
}

const CarFilterSidebar = ({ onFilterChange }: CarFilterSidebarProps) => {
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) => {
      const newTypes = prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type];
      
      onFilterChange({
        priceRange,
        types: newTypes,
        fuelTypes: selectedFuelTypes,
        options: selectedOptions
      });
      
      return newTypes;
    });
  };

  const handleFuelTypeChange = (type: string) => {
    setSelectedFuelTypes((prev) => {
      const newFuelTypes = prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type];
      
      onFilterChange({
        priceRange,
        types: selectedTypes,
        fuelTypes: newFuelTypes,
        options: selectedOptions
      });
      
      return newFuelTypes;
    });
  };

  const handleOptionChange = (option: string) => {
    setSelectedOptions((prev) => {
      const newOptions = prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option];
      
      onFilterChange({
        priceRange,
        types: selectedTypes,
        fuelTypes: selectedFuelTypes,
        options: newOptions
      });
      
      return newOptions;
    });
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
    onFilterChange({
      priceRange: values,
      types: selectedTypes,
      fuelTypes: selectedFuelTypes,
      options: selectedOptions
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Prix par jour</h3>
        <div className="px-2">
          <Slider 
            defaultValue={[0, 5000]} 
            max={5000} 
            step={10} 
            value={priceRange}
            onValueChange={handlePriceChange}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{priceRange[0]}Dh</span>
            <span>{priceRange[1]}Dh</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Type de véhicule</h3>
        <div className="space-y-2">
          {["SUV", "Berline", "Citadine"].map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox 
                id={`type-${type}`} 
                checked={selectedTypes.includes(type)}
                onCheckedChange={() => handleTypeChange(type)}
              />
              <Label htmlFor={`type-${type}`}>{type}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Carburant</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="type-electric" 
              checked={selectedFuelTypes.includes("Electrique")}
              onCheckedChange={() => handleFuelTypeChange("Electrique")}
            />
            <Battery className="h-4 w-4 text-blue-500" />
            <Label htmlFor="type-electric">Électrique</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="type-hybrid" 
              checked={selectedFuelTypes.includes("Hybride")}
              onCheckedChange={() => handleFuelTypeChange("Hybride")}
            />
            <Car className="h-4 w-4 text-green-500" />
            <Label htmlFor="type-hybrid">Hybride</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="type-essence" 
              checked={selectedFuelTypes.includes("Essence")}
              onCheckedChange={() => handleFuelTypeChange("Essence")}
            />
            <Fuel className="h-4 w-4 text-orange-500" />
            <Label htmlFor="type-essence">Essence</Label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Options</h3>
        <div className="space-y-2">
          {["GPS", "Climatisation", "Bluetooth", "Caméra de recul", "Sièges chauffants", "Toit ouvrant"].map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox 
                id={`option-${option}`} 
                checked={selectedOptions.includes(option)}
                onCheckedChange={() => handleOptionChange(option)}
              />
              <Label htmlFor={`option-${option}`}>{option}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarFilterSidebar;
