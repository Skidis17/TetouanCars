import React from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ALL = "all";

const CarsList: React.FC = () => {
  const [cars, setCars] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState(ALL);
  const [fuelFilter, setFuelFilter] = React.useState(ALL);
  const [seatsFilter, setSeatsFilter] = React.useState(ALL);
  const [priceFilter, setPriceFilter] = React.useState(ALL);
  const [optionFilter, setOptionFilter] = React.useState(ALL);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    axios.get("http://localhost:5000/manager/cars")
      .then(res => setCars(res.data.cars))
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  }, []);

  const getImage = (car: any) =>
    car.image ||
    "https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=400&q=80";

  const statusColor = (status: string) => {
    switch (status) {
      case "disponible":
        return "bg-green-100 text-green-800";
      case "indisponible":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer cette voiture ?")) return;
    try {
      await axios.delete(`http://localhost:5000/manager/cars/${id}`);
      setCars(cars.filter(car => car._id !== id));
    } catch {
      alert("Erreur lors de la suppression.");
    }
  };

  // Gather all unique options for the options filter
  const allOptions = Array.from(
    new Set(
      cars.flatMap((car) => (Array.isArray(car.options) ? car.options : []))
    )
  );

  // --- FILTERING LOGIC ---
  const filteredCars = cars.filter(car => {
    const matchesSearch =
      car.marque.toLowerCase().includes(search.toLowerCase()) ||
      car.modele.toLowerCase().includes(search.toLowerCase()) ||
      car.immatriculation.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter !== ALL ? car.status === statusFilter : true;
    const matchesFuel = fuelFilter !== ALL ? car.type_carburant === fuelFilter : true;
    const matchesSeats = seatsFilter !== ALL ? String(car.nombre_places) === seatsFilter : true;
    const matchesPrice =
      priceFilter !== ALL
        ? (() => {
            const price = Number(car.prix_journalier);
            switch (priceFilter) {
              case "lt30":
                return price < 30;
              case "30to50":
                return price >= 30 && price <= 50;
              case "51to100":
                return price > 50 && price <= 100;
              case "gt100":
                return price > 100;
              default:
                return true;
            }
          })()
        : true;
    const matchesOption =
      optionFilter !== ALL
        ? Array.isArray(car.options) && car.options.includes(optionFilter)
        : true;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesFuel &&
      matchesSeats &&
      matchesPrice &&
      matchesOption
    );
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Liste des Voitures</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSidebarOpen(true)}>
            <SlidersHorizontal className="w-4 h-4 mr-2" /> Filtres
          </Button>
          <Button onClick={() => navigate("/manager/cars/add")}>
            <Plus className="w-4 h-4 mr-2" /> Ajouter une voiture
          </Button>
        </div>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <Input
          placeholder="Recherche (marque, modèle, immatriculation...)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="md:w-1/3"
        />
      </div>

      {/* Sidebar for filters */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ maxWidth: "90vw" }}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Filtres</h2>
          <Button variant="ghost" onClick={() => setSidebarOpen(false)}>
            ✕
          </Button>
        </div>
        <div className="p-4 flex flex-col gap-4">
          <div>
            <label className="block mb-1 font-medium">Statut</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Tous</SelectItem>
                <SelectItem value="disponible">Disponible</SelectItem>
                <SelectItem value="indisponible">Indisponible</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Carburant</label>
            <Select value={fuelFilter} onValueChange={setFuelFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Carburant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Tous</SelectItem>
                <SelectItem value="Essence">Essence</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
                <SelectItem value="Hybride">Hybride</SelectItem>
                <SelectItem value="Electrique">Electrique</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Places</label>
            <Select value={seatsFilter} onValueChange={setSeatsFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Places" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Toutes</SelectItem>
                {[2, 4, 5, 7, 9].map(n => (
                  <SelectItem key={n} value={String(n)}>{n} places</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Prix</label>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Prix" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Tous</SelectItem>
                <SelectItem value="lt30">Moins de 30MAD</SelectItem>
                <SelectItem value="30to50">30MAD - 50MAD</SelectItem>
                <SelectItem value="51to100">51MAD - 100MAD</SelectItem>
                <SelectItem value="gt100">Plus de 100MAD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Options</label>
            <Select value={optionFilter} onValueChange={setOptionFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Options" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Toutes</SelectItem>
                {allOptions.map(opt => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={() => {
            setStatusFilter(ALL);
            setFuelFilter(ALL);
            setSeatsFilter(ALL);
            setPriceFilter(ALL);
            setOptionFilter(ALL);
          }}>
            Réinitialiser les filtres
          </Button>
        </div>
      </div>
      {/* Overlay for sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {loading ? (
        <div>Chargement...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredCars.map(car => (
            <Card
              key={car._id}
              className="flex flex-col shadow-lg border border-gray-200 hover:shadow-2xl transition-shadow duration-200 bg-white"
            >
              <div className="relative">
                <img
                  src={getImage(car)}
                  alt={`${car.marque} ${car.modele}`}
                  className="w-full h-48 object-cover rounded-t"
                />
                <span
                  className={`absolute top-2 right-2 px-3 py-1 text-xs rounded-full font-semibold shadow ${statusColor(
                    car.status
                  )}`}
                >
                  {car.status}
                </span>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">
                  {car.marque} {car.modele} <span className="text-gray-400 font-normal">({car.annee})</span>
                </CardTitle>
                <div className="text-sm text-gray-500">{car.immatriculation}</div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-2 text-sm">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">
                    {car.type_carburant}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                    {car.couleur}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                    {car.nombre_places} places
                  </span>
                </div>
                <div>
                  <b>Kilométrage:</b> {car.kilometrage} km
                </div>
                <div>
                  <b>Prix/Jour:</b> <span className="text-green-700 font-bold">{car.prix_journalier} MAD</span>
                </div>
                {car.options && car.options.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {car.options.map((opt: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded text-xs"
                      >
                        {opt}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/manager/cars/edit/${car._id}`)}
                  >
                    <Pencil className="w-4 h-4 mr-1" /> Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(car._id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarsList;