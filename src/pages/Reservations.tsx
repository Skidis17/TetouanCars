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
import { Phone, Mail, Edit, Trash, Plus, Search } from "lucide-react";

const Reservations = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
    }

    // Fetch reservations from backend
    const fetchReservations = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/reservations");
        setReservations(response.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, [navigate]);

  const filteredReservations = reservations.filter(
    (reservation) =>
      reservation.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.carModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/reservations/${id}`);
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

  const handleEdit = (id: string) => {
    navigate(`/edit-reservation/${id}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reservations</h1>
        <Button onClick={() => navigate("/add-reservation")}>
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
        <Button variant="outline" onClick={() => navigate("/calendar")}>
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
                    reservation.status === "Confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {reservation.status}
                  </span>
                </TableCell>
                <TableCell>${reservation.totalAmount}</TableCell>
                <TableCell>{reservation.paymentMethod || "N/A"}</TableCell>
                <TableCell>{reservation.paymentStatus || "N/A"}</TableCell>
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
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(reservation.id)}
                    >
                      <Edit className="h-4 w-4" />
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
