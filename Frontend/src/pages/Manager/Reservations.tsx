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

const Reservations = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/manager/login");
    }

    // Fetch reservations from backend
    const fetchReservations = async () => {
      try {
        const response = await axios.get("http://localhost:5000/manager/reservations");
        setReservations(response.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, [navigate]);

  const filteredReservations = reservations
    .filter((reservation) => reservation.status === "en attente")
    .filter(
      (reservation) =>
        reservation.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.carModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/manager/reservations/${id}`);
      setReservations(reservations.filter(res => res.id !== id));
      setDeleteDialogOpen(false);
      toast({
        title: "Reservation Deleted",
        description: "The reservation has been successfully deleted",
      });
    } catch (error) {
      console.error("Error deleting reservation:", error);
    }
  };

  const showDeleteDialog = (reservation: any) => {
    setSelectedReservation(reservation);
    setDeleteDialogOpen(true);
  };

  const handleContact = (method: string, contact: string) => {
    if (method === 'phone') {
      window.location.href = `tel:${contact}`;
    } else if (method === 'email') {
      window.location.href = `mailto:${contact}`;
    }
  };

  // Accept reservation
  const handleAccept = async (id: string) => {
    try {
      await axios.patch(`http://localhost:5000/manager/reservations/${id}`, { status: "acceptee" });
      setReservations(reservations.map(res => res.id === id ? { ...res, status: "acceptee" } : res));
      toast({ title: "Réservation acceptee" });
    } catch (error) {
      toast({ title: "Erreur lors de l'acceptation", variant: "destructive" });
    }
  };

  // Refuse reservation
  const handleRefuse = async (id: string) => {
    try {
      await axios.patch(`http://localhost:5000/manager/reservations/${id}`, { status: "refusée" });
      setReservations(reservations.map(res => res.id === id ? { ...res, status: "refusée" } : res));
      toast({ title: "Réservation refusée" });
    } catch (error) {
      toast({ title: "Erreur lors du refus", variant: "destructive" });
    }
  };

  // Toggle payment status
  const handleTogglePayment = async (id: string, currentStatus: string) => {
    if (currentStatus === "payée") {
      toast({ title: "Le paiement est déjà effectué", variant: "default" });
      return;
    }
    try {
      await axios.patch(`http://localhost:5000/manager/reservations/${id}`, { paymentStatus: "payée" });
      setReservations(reservations.map(res => res.id === id ? { ...res, paymentStatus: "payée" } : res));
      toast({ title: "Statut de paiement mis à jour" });
    } catch (error) {
      toast({ title: "Erreur lors de la mise à jour du paiement", variant: "destructive" });
    }
};

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reservations</h1>
        <Button onClick={() => navigate("/manager/add-reservation")}>
          <Plus className="mr-2 h-4 w-4" /> Add Reservation
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search by client, car, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline" onClick={() => navigate("/manager/calendar")}>
          View Calendar
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Car Model</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Reservation Date</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell className="font-medium">{reservation.clientName}</TableCell>
                <TableCell>{reservation.carModel}</TableCell>
                <TableCell>{new Date(reservation.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(reservation.endDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    reservation.status === "acceptee"
                      ? "bg-green-100 text-green-800"
                      : reservation.status === "refusée"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {reservation.status}
                  </span>
                </TableCell>
                <TableCell>${reservation.totalAmount}</TableCell>
                <TableCell>{reservation.paymentMethod || "N/A"}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant={reservation.paymentStatus === "payée" ? "default" : "outline"}
                    className={reservation.paymentStatus === "payée" ? "bg-green-100 text-green-800 border-green-300" : ""}
                    onClick={() => handleTogglePayment(reservation.id, reservation.paymentStatus)}
                    disabled={reservation.paymentStatus === "payée"}
                  >
                    {reservation.paymentStatus === "payée" ? "Payée" : "Non payée"}
                  </Button>
                </TableCell>
                <TableCell>{new Date(reservation.reservationDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleContact('phone', reservation.clientPhone)}
                      title="Call client"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleContact('email', reservation.clientEmail)}
                      title="Email client"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="default"
                    className="bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
                    onClick={() => handleAccept(reservation.id)}
                  >
                    Accepter
                  </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRefuse(reservation.id)}
                    >
                      Refuser
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => showDeleteDialog(reservation)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the reservation for{" "}
              {selectedReservation?.clientName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => handleDelete(selectedReservation?.id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reservations;
