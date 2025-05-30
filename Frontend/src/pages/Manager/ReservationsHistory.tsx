import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
import { Phone, Mail, Search } from "lucide-react";

const ReservationsHistory = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
    }

    // Fetch reservations from backend
    const fetchReservations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/manager/reservations");

      // Map backend response to frontend structure
      const mappedReservations = response.data.map((reservation: any) => ({
        id: reservation._id, // Map _id to id
        clientName: reservation.client?.name || "Unknown", // Map client.name
        clientEmail: reservation.client?.email || "Unknown", // Map client.email
        clientPhone: reservation.client?.phone || "Unknown", // Map client.phone
        carModel: reservation.car?.model || "Unknown", // Map car.model
        startDate: reservation.date_debut, // Map date_debut
        endDate: reservation.date_fin, // Map date_fin
        status: reservation.statut, // Map statut to status
        totalAmount: reservation.prix_total, // Map prix_total to totalAmount
        paymentMethod: reservation.paiement?.methode || "N/A", // Map paiement.methode
        paymentStatus: reservation.paiement?.statut || "non payée", // Map paiement.statut
        reservationDate: reservation.date_reservation, // Map date_reservation
      }));

      setReservations(mappedReservations);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

    fetchReservations();
  }, [navigate]);

  // Only show reservations that are "acceptee" or "refusée"
  const filteredReservations = reservations
    .filter(
      (reservation) =>
        reservation.status === "acceptée" || reservation.status === "refusée"
    )
    .filter(
      (reservation) =>
        reservation.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.carModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleContact = (method: string, contact: string) => {
    if (method === 'phone') {
      window.location.href = `tel:${contact}`;
    } else if (method === 'email') {
      window.location.href = `mailto:${contact}`;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Historique des réservations</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-gray-500" />
        <Input
          placeholder="Rechercher par client, voiture, ou statut..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline" onClick={() => navigate("/manager/calendar")}>
          Voir le calendrier
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Voiture</TableHead>
              <TableHead>Date début</TableHead>
              <TableHead>Date fin</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Méthode de paiement</TableHead>
              <TableHead>Statut paiement</TableHead>
              <TableHead>Date réservation</TableHead>
              <TableHead>Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReservations.map((reservation: any) => (
              <TableRow key={reservation.id}>
                <TableCell className="font-medium">{reservation.clientName}</TableCell>
                <TableCell>{reservation.carModel}</TableCell>
                <TableCell>{new Date(reservation.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(reservation.endDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    reservation.status === "acceptée"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {reservation.status}
                  </span>
                </TableCell>
                <TableCell>{reservation.totalAmount} MAD</TableCell>
                <TableCell>{reservation.paymentMethod || "N/A"}</TableCell>
                <TableCell>{reservation.paymentStatus || "N/A"}</TableCell>
                <TableCell>{reservation.reservationDate || "N/A"}</TableCell>                
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleContact('phone', reservation.clientPhone)}
                      title="Appeler le client"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleContact('email', reservation.clientEmail)}
                      title="Envoyer un email"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReservationsHistory;