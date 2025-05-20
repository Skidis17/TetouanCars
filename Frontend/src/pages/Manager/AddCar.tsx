import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useForm, Controller } from "react-hook-form";

const carSchema = z.object({
  marque: z.string().min(1, "Champ requis"),
  modele: z.string().min(1, "Champ requis"),
  annee: z.string().min(4, "Champ requis"),
  immatriculation: z.string().min(1, "Champ requis"),
  couleur: z.string().min(1, "Champ requis"),
  kilometrage: z.string().min(1, "Champ requis"),
  prix_journalier: z.string().min(1, "Champ requis"),
  type_carburant: z.enum(["Hybride", "Essence", "Electrique", "Diesel"], { message: "Sélectionnez un type de carburant" }),
  nombre_places: z.string().min(1, "Champ requis"),
  image: z.string().optional(),
  options: z.string().optional(), // comma separated
});

const AddCar: React.FC = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof carSchema>>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      marque: "",
      modele: "",
      annee: "",
      immatriculation: "",
      couleur: "",
      kilometrage: "",
      prix_journalier: "",
      type_carburant: undefined,
      nombre_places: "",
      image: "",
      options: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof carSchema>) => {
    try {
      await axios.post("http://localhost:5000/manager/cars", {
        ...values,
        annee: Number(values.annee),
        kilometrage: Number(values.kilometrage),
        prix_journalier: Number(values.prix_journalier),
        nombre_places: Number(values.nombre_places),
        options: values.options
          ? values.options.split(",").map((opt) => opt.trim())
          : [],
      });
      toast({ title: "Voiture ajoutée avec succès" });
      navigate("/manager/CarsList");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Erreur lors de l'ajout de la voiture",
      });
    }
  };

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Ajouter une voiture</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Input {...form.register("marque")} placeholder="Marque" />
            <Input {...form.register("modele")} placeholder="Modèle" />
            <Input {...form.register("annee")} type="number" min={1900} placeholder="Année" />
            <Input {...form.register("immatriculation")} placeholder="Immatriculation" />
            <Input {...form.register("couleur")} placeholder="Couleur" />
            <Input {...form.register("kilometrage")} type="number" min={0} placeholder="Kilométrage" />
            <Input {...form.register("prix_journalier")} type="number" min={0} placeholder="Prix journalier (€)" />
            <Controller
              control={form.control}
              name="type_carburant"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
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
              )}
            />
            <Input {...form.register("nombre_places")} type="number" min={1} placeholder="Nombre de places" />
            <Input {...form.register("image")} placeholder="URL de l'image (optionnel)" />
            <Input {...form.register("options")} placeholder="Options (séparées par des virgules)" />
            <div className="flex gap-2 mt-4">
              <Button type="submit">Ajouter</Button>
              <Button type="button" variant="outline" onClick={() => navigate("/CarsList")}>
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCar;