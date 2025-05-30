import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/managerApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Phone, Mail, Trash, Plus, Search } from "lucide-react";

interface Client {
  name: string;
  email: string;
  phone: string;
}

interface Car {
  model: string;
}

interface Payment {
  methode: string;
  statut: string;
}

interface Reservation {
  _id: string;
  client?: Client; // Made optional
  car?: Car; // Made optional
  date_debut: string;
  date_fin: string;
  statut: string;
  prix_total: number;
  paiement: Payment;
  date_reservation: string;
}

const Reservations = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) navigate("/manager/login");

    const loadData = async () => {
      try {
        const [reservationsData] = await Promise.all([
          API.getReservations()
        ]);
        console.log("API Response:", reservationsData); // Debug log
        setReservations(reservationsData || []); // Ensure array even if undefined
      } catch (error) {
        console.error("Error loading reservations:", error);
        toast({
          title: "Erreur de chargement",
          description: "Échec du chargement des données",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  // Safe filtering with null checks
  const filteredReservations = reservations
    .filter((r) => r.statut === "en attente")
    .filter(r => {
      const clientName = r.client?.name?.toLowerCase() || "";
      const carModel = r.car?.model?.toLowerCase() || "";
      return clientName.includes(searchTerm.toLowerCase()) || 
             carModel.includes(searchTerm.toLowerCase());
    });

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("fr-FR");
    } catch {
      return "N/A";
    }
  };

  const handleDelete = async () => {
    if (!selectedReservation) return;
    try {
      await API.deleteReservation(selectedReservation._id);
      setReservations(reservations.filter(r => r._id !== selectedReservation._id));
      setDeleteDialogOpen(false);
      toast({ title: "Réservation supprimée avec succès" });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Erreur de suppression",
        variant: "destructive"
      });
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      // Send the correct payload to the PATCH endpoint
      await API.updateReservationStatus(id, { status: newStatus });

      // Update the local state
      setReservations(reservations.map(r =>
        r._id === id ? { ...r, statut: newStatus } : r
      ));
      toast({ title: `Statut mis à jour: ${newStatus}` });
    } catch (error) {
      console.error("Status update error:", error);
      toast({
        title: "Erreur de mise à jour",
        variant: "destructive"
      });
    }
  };

  const handlePaymentUpdate = async (id: string) => {
    try {
      const reservation = reservations.find(r => r._id === id);
      if (!reservation) return;

      const newStatus = reservation.paiement.statut === "payée" ? "non payée" : "payée";

      // Send the correct payload to the PATCH endpoint
      await API.updateReservationStatus(id, { paymentStatus: newStatus });

      // Update the local state
      setReservations(reservations.map(r =>
        r._id === id
          ? { ...r, paiement: { ...r.paiement, statut: newStatus } }
          : r
      ));
      toast({ title: `Paiement ${newStatus}` });
    } catch (error) {
      console.error("Payment update error:", error);
      toast({
        title: "Erreur de paiement",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Chargement en cours...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des Réservations</h1>
        <Button onClick={() => navigate("/manager/add-reservation")}>
          <Plus className="mr-2 h-4 w-4" /> Nouvelle
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-gray-500" />
        <Input
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Voiture</TableHead>
              <TableHead>Début</TableHead>
              <TableHead>Fin</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Paiement</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReservations.length > 0 ? (
              filteredReservations.map((reservation) => (
                <TableRow key={reservation._id}>
                  <TableCell>
                    <div className="font-medium">{reservation.client?.name || "N/A"}</div>
                    <div className="text-sm text-gray-500">
                      {reservation.client?.phone || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{reservation.car?.model || "N/A"}</div>
                  </TableCell>
                  <TableCell>{formatDate(reservation.date_debut)}</TableCell>
                  <TableCell>{formatDate(reservation.date_fin)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      reservation.statut === "acceptée" ? "bg-green-100 text-green-800" :
                      reservation.statut === "refusée" ? "bg-red-100 text-red-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {reservation.statut}
                    </span>
                  </TableCell>
                  <TableCell>{reservation.prix_total} DH</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={reservation.paiement.statut === "payée" ? "default" : "outline"}
                      onClick={() => handlePaymentUpdate(reservation._id)}
                    >
                      {reservation.paiement.statut}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-100 text-green-800 hover:bg-green-200"
                        onClick={() => handleStatusUpdate(reservation._id, "acceptée")}
                      >
                        Accepter
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStatusUpdate(reservation._id, "refusée")}
                      >
                        Refuser
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedReservation(reservation);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Aucune réservation en attente trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer suppression</DialogTitle>
            <DialogDescription>
              Supprimer la réservation de {selectedReservation?.client?.name || "ce client"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reservations;