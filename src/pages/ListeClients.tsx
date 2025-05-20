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
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, Search } from "lucide-react";

const ListeClients = () => {
  const [clients, setClients] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState("");
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
    _id: undefined,
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

  const handleAddOrEditClient = async () => {
    if (editMode) {
      // Edit client
      try {
        await axios.put(`http://localhost:5000/api/clients/${newClient._id}`, newClient);
        setClients(clients.map((c) => (c._id === newClient._id ? newClient : c)));
        setDialogOpen(false);
        setEditMode(false);
        toast({
          title: "Client modifié",
          description: "Le client a été modifié avec succès.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Échec de la modification du client.",
        });
      }
    } else {
      // Add client
      try {
        const response = await axios.post("http://localhost:5000/api/clients", newClient);
        setClients([...clients, { ...newClient, _id: response.data.id }]);
        setDialogOpen(false);
        toast({
          title: "Client ajouté",
          description: "Le client a été ajouté avec succès.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Échec de l'ajout du client.",
        });
      }
    }
    setNewClient({
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
      _id: undefined,
    });
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

  // Open dialog for edit
  const openEditDialog = (client: any) => {
    setNewClient({ ...client });
    setEditMode(true);
    setDialogOpen(true);
  };

  // Open dialog for add
  const openAddDialog = () => {
    setNewClient({
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
      _id: undefined,
    });
    setEditMode(false);
    setDialogOpen(true);
  };

  // Filtered clients
  const filteredClients = clients.filter(
    (client) =>
      client.nom.toLowerCase().includes(search.toLowerCase()) ||
      client.prenom.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase()) ||
      client.telephone.toLowerCase().includes(search.toLowerCase()) ||
      (client.CIN && client.CIN.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Liste des Clients</h1>
        <div className="flex gap-2">
          <Button onClick={openAddDialog}>
            <Plus className="w-4 h-4 mr-1" /> Ajouter
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Search className="h-4 w-4 text-gray-500" />
        <Input
          placeholder="Rechercher un client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
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
            {filteredClients.map((client) => (
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
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(client)}
                      title="Modifier"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setClientToDelete(client);
                        setDeleteDialogOpen(true);
                      }}
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Client Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editMode ? "Modifier le client" : "Ajouter un client"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <Input
                placeholder="Nom"
                value={newClient.nom}
                onChange={(e) => setNewClient({ ...newClient, nom: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prénom</label>
              <Input
                placeholder="Prénom"
                value={newClient.prenom}
                onChange={(e) => setNewClient({ ...newClient, prenom: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                placeholder="Email"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Téléphone</label>
              <Input
                placeholder="Téléphone"
                value={newClient.telephone}
                onChange={(e) => setNewClient({ ...newClient, telephone: e.target.value })}
              />
            </div>
            {/* Address Fields */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Adresse</h3>
              <div>
                <label className="block text-xs mb-1">Rue</label>
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
              </div>
              <div>
                <label className="block text-xs mb-1">Immeuble</label>
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
              </div>
              <div>
                <label className="block text-xs mb-1">Appartement</label>
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
              </div>
              <div>
                <label className="block text-xs mb-1">Ville</label>
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
              </div>
              <div>
                <label className="block text-xs mb-1">Code Postal</label>
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
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CIN</label>
              <Input
                placeholder="CIN"
                value={newClient.CIN}
                onChange={(e) => setNewClient({ ...newClient, CIN: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Permis de Conduire</label>
              <Input
                placeholder="Permis de Conduire"
                value={newClient.permis_conduire}
                onChange={(e) =>
                  setNewClient({ ...newClient, permis_conduire: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Numéro de Permis</label>
              <Input
                placeholder="Numéro de Permis"
                value={newClient.numero_permis}
                onChange={(e) =>
                  setNewClient({ ...newClient, numero_permis: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddOrEditClient}>
              {editMode ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete Client Dialog */}
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