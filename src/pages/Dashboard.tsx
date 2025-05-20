import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Calendar as CalendarIcon, Users, FileText } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalReservations: 0,
    availableCars: 0,
    activeClients: 0,
  });
  const [upcomingReservations, setUpcomingReservations] = useState([]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
    }

    // Fetch Dashboard Stats
    const fetchStats = async () => {
      try {
        const statsResponse = await axios.get("http://localhost:5000/api/dashboard/stats");
        setStats(statsResponse.data);

        const reservationsResponse = await axios.get("http://localhost:5000/api/dashboard/upcoming-reservations");
        setUpcomingReservations(reservationsResponse.data.upcomingReservations);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchStats();
  }, [navigate]);

  return (
    <div className="p-6 space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">
          Tableau de Bord
        </h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate("/reservations")}
            className="hover:bg-primary/10"
          >
            Gérer les Réservations
          </Button>
          <Button 
            onClick={() => navigate("/calendar")}
            className="bg-primary hover:bg-primary/90"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Voir le Calendrier
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Réservations Totales</CardTitle>
            <FileText className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalReservations}</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Voitures Disponibles</CardTitle>
            <Car className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.availableCars}</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Clients Actifs</CardTitle>
            <Users className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.activeClients}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Réservations à Venir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingReservations
                .filter(reservation => reservation.status !== "refusée")
                .map((reservation, index) => (
                  <div key={index} className="p-3 border rounded-md flex justify-between items-center bg-secondary/50">
                    <div>
                      <p className="font-medium">{reservation.clientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {reservation.carModel} - {new Date(reservation.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      reservation.status === "acceptée"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {reservation.status}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Aperçu Mensuel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border p-3 bg-white">
              <Calendar
                mode="single"
                className="rounded-md"
                classNames={{}}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
