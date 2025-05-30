import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EditCar: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/manager/cars`)
      .then(res => {
        const found = res.data.cars.find((c: any) => c._id === id);
        setCar(found);
      })
      .catch(() => setError("Erreur lors du chargement de la voiture."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  const handleCarburantChange = (value: string) => {
    setCar({ ...car, type_carburant: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await axios.put(`http://localhost:5000/manager/cars/${id}`, car);
      navigate("/manager/CarsList");
    } catch {
      setError("Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Chargement...</div>;
  if (!car) return <div className="p-6 text-red-600">Voiture introuvable.</div>;

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Modifier la voiture</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="marque">Marque</label>
              <Input
                id="marque"
                name="marque"
                value={car.marque}
                onChange={handleChange}
                placeholder="Marque"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="modele">Modèle</label>
              <Input
                id="modele"
                name="modele"
                value={car.modele}
                onChange={handleChange}
                placeholder="Modèle"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="annee">Année</label>
              <Input
                id="annee"
                name="annee"
                type="number"
                min={0}
                value={car.annee}
                onChange={handleChange}
                placeholder="Année"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="immatriculation">Immatriculation</label>
              <Input
                id="immatriculation"
                name="immatriculation"
                value={car.immatriculation}
                onChange={handleChange}
                placeholder="Immatriculation"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="couleur">Couleur</label>
              <Input
                id="couleur"
                name="couleur"
                value={car.couleur}
                onChange={handleChange}
                placeholder="Couleur"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="kilometrage">Kilométrage</label>
              <Input
                id="kilometrage"
                name="kilometrage"
                type="number"
                min={0}
                value={car.kilometrage}
                onChange={handleChange}
                placeholder="Kilométrage"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="prix_journalier">Prix journalier (MAD)</label>
              <Input
                id="prix_journalier"
                name="prix_journalier"
                type="number"
                min={0}
                value={car.prix_journalier}
                onChange={handleChange}
                placeholder="Prix journalier"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="type_carburant">Type de carburant</label>
              <Select value={car.type_carburant} onValueChange={handleCarburantChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Type de carburant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hybride">Hybride</SelectItem>
                  <SelectItem value="Essence">Essence</SelectItem>
                  <SelectItem value="Electrique">Electrique</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="nombre_places">Nombre de places</label>
              <Input
                id="nombre_places"
                name="nombre_places"
                type="number"
                min={0}
                value={car.nombre_places}
                onChange={handleChange}
                placeholder="Nombre de places"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="image">URL de l'image</label>
              <Input
                id="image"
                name="image"
                value={car.image}
                onChange={handleChange}
                placeholder="URL de l'image"
              />
            </div>
            {error && <div className="text-red-600">{error}</div>}
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Sauvegarde..." : "Enregistrer"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/manager/CarsList")}>
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCar;