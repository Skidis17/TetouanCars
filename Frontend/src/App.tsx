import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./components/Auth/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ReservationsList from "./components/Admin/ReservationsList";
import ClientsList from "./components/Admin/ClientsList";
import ManagersList from "./components/Admin/ManagersList";
import VoitureList from "./components/Admin/VoitureList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />}>
        <Route path="reservations" element={<ReservationsList />} />
        <Route path="clients" element={<ClientsList />} />
        <Route path="managers" element={<ManagersList />} />
        <Route path="voitures" element={<VoitureList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
