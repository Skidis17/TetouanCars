
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import CarListings from "./pages/CarListings";
import CarDetails from "./pages/CarDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Dashboard from "./pages/Manager/Dashboard";
import Login from "./pages/Manager/Login";
import Reservations from "./pages/Manager/Reservations";
import CalendarView from "./pages/Manager/CalendarView";
import AddReservation from "./pages/Manager/AddReservation";
import EditReservation from "@/pages/Manager/EditReservation";
import ListeClients from "./pages/Manager/ListeClients";
import CarsList from "@/pages/Manager/CarsList";
import EditCar from "@/pages/Manager/EditCar";
import AddCar from "@/pages/Manager/AddCar";
import ReservationsHistory from "@/pages/Manager/ReservationsHistory";
import AdminLayout from "./components/AdminLayout";

import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ReservationsList from "./components/Admin/ReservationsList";
import ManagersList from "./components/Admin/ManagersList";
import { Outlet } from "react-router-dom";
import ClientsList from "./components/Admin/ClientsList";
import VoitureList from "./components/Admin/VoitureList";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/reservations" element={<ReservationsList />} />
          <Route path="/admin/clients" element={<ClientsList />} />
          <Route path="/admin/managers" element={<ManagersList />} />
          <Route path="/admin/voitures" element={<VoitureList />} />
          <Route path="/" element={<Index />} />
          <Route path="/cars" element={<CarListings />} />
          <Route path="/cars/:id" element={<CarDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
          
      
          <Route path="/manager/login" element={<Login />} />
          
          <Route path="/manager/dashboard" element={ 
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/manager/reservations" element={
            <ProtectedRoute>
              <Layout>
                <Reservations />
              </Layout>
            </ProtectedRoute>
          } />

          {/* <Route path="/manager/edit-reservation/:id" element={
            <ProtectedRoute>
              <Layout>
                <EditReservation />
              </Layout>
            </ProtectedRoute>
          } /> */}
          
          <Route path="/manager/add-reservation" element={
            <ProtectedRoute>
              <Layout>
                <AddReservation />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/manager/calendar" element={
            <ProtectedRoute>
              <Layout>
                <CalendarView />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/manager/clients" element={
            <ProtectedRoute>
              <Layout>
                <ListeClients />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/manager/carsList" element={
            <ProtectedRoute>
              <Layout>
                <CarsList />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/manager/cars/edit/:id" element={
            <ProtectedRoute>
              <Layout>
                <EditCar />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/manager/cars/add" element={
            <ProtectedRoute>
              <Layout>
                <AddCar />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/manager/reservations-history" element={
            <ProtectedRoute>
              <Layout>
                <ReservationsHistory />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/" element={<Navigate to="/manager/login" replace />} />
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
