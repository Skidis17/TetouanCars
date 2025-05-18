import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Reservations from "./pages/Reservations";
import CalendarView from "./pages/CalendarView";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AddReservation from "./pages/AddReservation";
import EditReservation from "@/pages/EditReservation";
import ListeClients from "./pages/ListeClients";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/reservations" element={
            <ProtectedRoute>
              <Layout>
                <Reservations />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/edit-reservation/:id" element={
            <ProtectedRoute>
              <Layout>
                <EditReservation />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/add-reservation" element={
            <ProtectedRoute>
              <Layout>
                <AddReservation />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/calendar" element={
            <ProtectedRoute>
              <Layout>
                <CalendarView />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/clients" element={
            <ProtectedRoute>
              <Layout>
                <ListeClients />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
