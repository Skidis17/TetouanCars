import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

const initialCar = {
  marque: "",
  modele: "",
  annee: "",
  immatriculation: "",
  couleur: "",
  kilometrage: "",
  prix_journalier: "",
  status: "disponible",
  type_carburant: "",
  nombre_places: "",
  options: "",
  image: "",
};

const ListeCars = () => {
  const [cars, setCars] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newCar, setNewCar] = useState(initialCar);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    const res = await axios.get("http://localhost:5000/api/cars");
    setCars(res.data.cars);
  };

  const handleDeleteCar = async () => {
    if (!carToDelete) return;
    await axios.delete(`http://localhost:5000/api/cars/${carToDelete._id}`);
    setCars(cars.filter((c) => c._id !== carToDelete._id));
    setDialogOpen(false);
    setCarToDelete(null);
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
    const payload = {
      ...newCar,
      annee: Number(newCar.annee),
      kilometrage: Number(newCar.kilometrage),
      prix_journalier: Number(newCar.prix_journalier),
      nombre_places: Number(newCar.nombre_places),
      options: newCar.options
        ? newCar.options.split(",").map((o) => o.trim())
        : [],
    };
    const res = await axios.post("http://localhost:5000/api/cars", payload);
    setCars([...cars, res.data]);
    setAddDialogOpen(false);
    setNewCar(initialCar);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Liste des Voitures</h1>
        <Button onClick={() => setAddDialogOpen(true)}>Ajouter une voiture</Button>
      </div>
      <table className="w-full border-collapse rounded-md border">
        <thead>
          <tr>
            <th>Marque</th>
            <th>Modèle</th>
            <th>Année</th>
            <th>Plaque</th>
            <th>Couleur</th>
            <th>Kilométrage</th>
            <th>Prix/Jour</th>
            <th>Status</th>
            <th>Carburant</th>
            <th>Places</th>
            <th>Options</th>
            <th>Date ajout</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car._id}>
              <td>{car.marque}</td>
              <td>{car.modele}</td>
              <td>{car.annee}</td>
              <td>{car.immatriculation}</td>
              <td>{car.couleur}</td>
              <td>{car.kilometrage}</td>
              <td>{car.prix_journalier}</td>
              <td>{car.status}</td>
              <td>{car.type_carburant}</td>
              <td>{car.nombre_places}</td>
              <td>{car.options?.join(", ")}</td>
              <td>
                {car.date_ajout
                  ? new Date(car.date_ajout).toLocaleDateString()
                  : ""}
              </td>
              <td>
                {car.image && (
                  <img
                    src={car.image}
                    alt={car.modele}
                    style={{ width: 60, height: 40, objectFit: "cover" }}
                  />
                )}
              </td>
              <td>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setCarToDelete(car);
                    setDialogOpen(true);
                  }}
                >
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Car Dialog */}
      {addDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            className="bg-white p-6 rounded shadow space-y-4 w-full max-w-lg"
            onSubmit={handleAddCar}
          >
            <h2 className="text-xl font-bold mb-2">Ajouter une voiture</h2>
            <div className="grid grid-cols-2 gap-2">
              <input
                className="border p-2"
                placeholder="Marque"
                value={newCar.marque}
                onChange={(e) =>
                  setNewCar({ ...newCar, marque: e.target.value })
                }
                required
              />
              <input
                className="border p-2"
                placeholder="Modèle"
                value={newCar.modele}
                onChange={(e) =>
                  setNewCar({ ...newCar, modele: e.target.value })
                }
                required
              />
              <input
                className="border p-2"
                placeholder="Année"
                type="number"
                value={newCar.annee}
                onChange={(e) =>
                  setNewCar({ ...newCar, annee: e.target.value })
                }
                required
              />
              <input
                className="border p-2"
                placeholder="Plaque"
                value={newCar.immatriculation}
                onChange={(e) =>
                  setNewCar({ ...newCar, immatriculation: e.target.value })
                }
                required
              />
              <input
                className="border p-2"
                placeholder="Couleur"
                value={newCar.couleur}
                onChange={(e) =>
                  setNewCar({ ...newCar, couleur: e.target.value })
                }
                required
              />
              <input
                className="border p-2"
                placeholder="Kilométrage"
                type="number"
                value={newCar.kilometrage}
                onChange={(e) =>
                  setNewCar({ ...newCar, kilometrage: e.target.value })
                }
                required
              />
              <input
                className="border p-2"
                placeholder="Prix/Jour"
                type="number"
                value={newCar.prix_journalier}
                onChange={(e) =>
                  setNewCar({ ...newCar, prix_journalier: e.target.value })
                }
                required
              />
              <input
                className="border p-2"
                placeholder="Status"
                value={newCar.status}
                onChange={(e) =>
                  setNewCar({ ...newCar, status: e.target.value })
                }
              />
              <input
                className="border p-2"
                placeholder="Carburant"
                value={newCar.type_carburant}
                onChange={(e) =>
                  setNewCar({ ...newCar, type_carburant: e.target.value })
                }
                required
              />
              <input
                className="border p-2"
                placeholder="Places"
                type="number"
                value={newCar.nombre_places}
                onChange={(e) =>
                  setNewCar({ ...newCar, nombre_places: e.target.value })
                }
                required
              />
              <input
                className="border p-2"
                placeholder="Options (séparées par des virgules)"
                value={newCar.options}
                onChange={(e) =>
                  setNewCar({ ...newCar, options: e.target.value })
                }
              />
              <input
                className="border p-2"
                placeholder="Image URL"
                value={newCar.image}
                onChange={(e) =>
                  setNewCar({ ...newCar, image: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                type="button"
                onClick={() => setAddDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit">Ajouter</Button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow space-y-4">
            <p>Supprimer cette voiture ?</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleDeleteCar}>
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeCars;