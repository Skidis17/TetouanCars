import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, addDays, isSameDay, startOfWeek, addWeeks, subWeeks } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";

const CalendarView = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(currentDate, { weekStartsOn: 0 }));
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
    }

    // Fetch reservations from the backend
    const fetchReservations = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/calendar/reservations");
        setReservations(response.data.reservations);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch reservations.",
        });
      }
    };

    fetchReservations();
  }, [navigate]);

  // Helper to get array of 7 days starting from currentWeek
  const getDaysInWeek = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(currentWeek, i));
    }
    return days;
  };

  const weekDays = getDaysInWeek();

  // Navigate to next/previous weeks
  const goToPrevWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));
  const goToNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));

  // Find reservations for a specific day
  const getReservationsForDay = (day) => {
    return reservations.filter((reservation) => {
      const startDate = new Date(reservation.startDate);
      const endDate = new Date(reservation.endDate);
      const currentDate = new Date(day);

      // Check if the current day falls within the reservation period
      return (
        (currentDate >= startDate && currentDate <= endDate) ||
        isSameDay(currentDate, startDate) ||
        isSameDay(currentDate, endDate)
      );
    });
  };

  const handleReservationClick = (reservation) => {
    setSelectedReservation(reservation);
    setDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Calendrier</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/reservations")}>
            Toutes les Réservations
          </Button>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Retour au Tableau de Bord
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle>Calendrier des Réservations</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={goToPrevWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="font-medium">
              {format(weekDays[0], "d MMM")} - {format(weekDays[6], "d MMM yyyy")}
            </div>
            <Button variant="outline" size="icon" onClick={goToNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {/* Days of week */}
            {weekDays.map((day) => (
              <div key={day.toString()} className="text-center p-2 font-medium">
                {format(day, "EEE")}
                <div className="text-xs text-muted-foreground">{format(day, "d MMM")}</div>
              </div>
            ))}

            {/* Calendar cells */}
            {weekDays.map((day) => {
              // Filter out refusée reservations
              const dayReservations = getReservationsForDay(day).filter(
                (reservation) => reservation.status !== "refusée"
              );
              return (
                <div
                  key={day.toString() + "-cell"}
                  className={`min-h-[120px] border rounded-md ${
                    isSameDay(day, new Date()) ? "bg-secondary/50" : ""
                  }`}
                >
                  <div className="h-full p-2">
                    <div className="text-xs text-right text-muted-foreground">{format(day, "d")}</div>
                    <div className="space-y-1 mt-1">
                      {dayReservations.map((reservation) => (
                        <div
                          key={reservation.id}
                          onClick={() => handleReservationClick(reservation)}
                          className={`text-xs p-1 rounded cursor-pointer transition-colors ${
                            reservation.status === "acceptée"
                                ? "bg-green-100 hover:bg-green-200 text-green-800"
                                : "bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
                            }`}
                        >
                          <div className="font-medium truncate">{reservation.carModel}</div>
                          <div className="truncate">{reservation.clientName}</div>
                        </div>
                      ))}

                      {dayReservations.length === 0 && (
                        <div className="text-xs text-muted-foreground h-full flex items-center justify-center">
                          Aucune réservation
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Reservation Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails de la Réservation</DialogTitle>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium">{selectedReservation.clientName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Véhicule</p>
                  <p className="font-medium">{selectedReservation.carModel}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date de début</p>
                  <p className="font-medium">{format(new Date(selectedReservation.startDate), "dd/MM/yyyy")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date de fin</p>
                  <p className="font-medium">{format(new Date(selectedReservation.endDate), "dd/MM/yyyy")}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarView;
