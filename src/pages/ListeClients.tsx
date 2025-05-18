import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { DialogDescription } from "@/components/ui/dialog";

const ListeClients = () => {
  const [clients, setClients] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: {
      rue: "",
      immeuble: "",
      appartement: "",
      ville: "",
      code_postal: "",
    },
    CIN: "",
    permis_conduire: "",
    numero_permis: "",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);


  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/clients");
        setClients(response.data.clients);
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch clients.",
        });
      }
    };

    fetchClients();
  }, []);

  const handleAddClient = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/clients", newClient);
      setClients([...clients, { ...newClient, _id: response.data.id }]);
      setDialogOpen(false);
      toast({
        title: "Client Added",
        description: "The client has been added successfully.",
      });
    } catch (error) {
      console.error("Error adding client:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add client.",
      });
    }
  };

    // Delete client handler
    const handleDeleteClient = async () => {
      if (!clientToDelete) return;
      try {
        await axios.delete(`http://localhost:5000/api/clients/${clientToDelete._id}`);
        setClients(clients.filter((c) => c._id !== clientToDelete._id));
        setDeleteDialogOpen(false);
        setClientToDelete(null);
        toast({
          title: "Client supprimé",
          description: "Le client a été supprimé avec succès.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Échec de la suppression du client.",
        });
      }
    };


  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Liste des Clients</h1>
        <Button onClick={() => setDialogOpen(true)}>Add Client</Button>
      </div>

      <div className="rounded-md border">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Nom</th>
              <th className="border p-2">Prénom</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Téléphone</th>
              <th className="border p-2">Adresse</th>
              <th className="border p-2">CIN</th>
              <th className="border p-2">Permis</th>
              <th className="border p-2">Actions</th> 
            </tr>
          </thead>
        <tbody>
            {clients.map((client) => (
                <tr key={client._id}>
                <td className="border p-2">{client.nom}</td>
                <td className="border p-2">{client.prenom}</td>
                <td className="border p-2">{client.email}</td>
                <td className="border p-2">{client.telephone}</td>
                <td className="border p-2">
                {client.adresse
                    ? `${client.adresse.rue || ""}, ${client.adresse.immeuble || ""}, ${
                        client.adresse.appartement || ""
                    }, ${client.adresse.ville || ""}, ${client.adresse.code_postal || ""}`
                    : "N/A"}
                </td>
                <td className="border p-2">{client.CIN}</td>
                <td className="border p-2">{client.numero_permis}</td>
                 <td className="border p-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setClientToDelete(client);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    Supprimer
                  </Button>
                </td>
                </tr>
            ))}
        </tbody>
        </table>
      </div>

      {/* Add Client Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
        <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>

      
        {/* Add a scrollable container */}
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <Input
            placeholder="Nom"
            value={newClient.nom}
            onChange={(e) => setNewClient({ ...newClient, nom: e.target.value })}
            />
            <Input
            placeholder="Prénom"
            value={newClient.prenom}
            onChange={(e) => setNewClient({ ...newClient, prenom: e.target.value })}
            />
            <Input
            placeholder="Email"
            value={newClient.email}
            onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
            />
            <Input
            placeholder="Téléphone"
            value={newClient.telephone}
            onChange={(e) => setNewClient({ ...newClient, telephone: e.target.value })}
            />
        
            {/* Address Fields */}
            <div className="space-y-2">
            <h3 className="text-sm font-medium">Adresse</h3>
            <Input
                placeholder="Rue"
                value={newClient.adresse.rue}
                onChange={(e) =>
                setNewClient({
                    ...newClient,
                    adresse: { ...newClient.adresse, rue: e.target.value },
                })
                }
            />
            <Input
                placeholder="Immeuble"
                value={newClient.adresse.immeuble}
                onChange={(e) =>
                setNewClient({
                    ...newClient,
                    adresse: { ...newClient.adresse, immeuble: e.target.value },
                })
                }
            />
            <Input
                placeholder="Appartement"
                value={newClient.adresse.appartement}
                onChange={(e) =>
                setNewClient({
                    ...newClient,
                    adresse: { ...newClient.adresse, appartement: e.target.value },
                })
                }
            />
            <Input
                placeholder="Ville"
                value={newClient.adresse.ville}
                onChange={(e) =>
                setNewClient({
                    ...newClient,
                    adresse: { ...newClient.adresse, ville: e.target.value },
                })
                }
            />
            <Input
                placeholder="Code Postal"
                value={newClient.adresse.code_postal}
                onChange={(e) =>
                setNewClient({
                    ...newClient,
                    adresse: { ...newClient.adresse, code_postal: e.target.value },
                })
                }
            />
            </div>
        
            <Input
            placeholder="CIN"
            value={newClient.CIN}
            onChange={(e) => setNewClient({ ...newClient, CIN: e.target.value })}
            />
            <Input
            placeholder="Permis de Conduire"
            value={newClient.permis_conduire}
            onChange={(e) =>
                setNewClient({ ...newClient, permis_conduire: e.target.value })
            }
            />
            <Input
            placeholder="Numéro de Permis"
            value={newClient.numero_permis}
            onChange={(e) =>
                setNewClient({ ...newClient, numero_permis: e.target.value })
            }
            />
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Cancel
            </Button>
            <Button onClick={handleAddClient}>Add Client</Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>

       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le client</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce client&nbsp;?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteClient}>
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListeClients;