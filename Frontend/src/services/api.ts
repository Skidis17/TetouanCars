import axios from "axios";

const API_URL = "http://localhost:5000/";

const loginAdmin = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/admin/login`, { email, password });
  return response.data;
};

const getReservations = async () => {
  const response = await axios.get(`${API_URL}/admin/reservations`);
  return response.data;
};

const getClients = async () => {
  const response = await axios.get(`${API_URL}/admin/clients`);
  return response.data;
};

const getManagers = async () => {
  const response = await axios.get(`${API_URL}/admin/managers`);
  return response.data;
};

const addManager = async (manager: any) => {
  const response = await axios.post(`${API_URL}/admin/managers`, manager);
  return response.data;
};

const updateManager = async (id: string, manager: any) => {
  const response = await axios.put(`${API_URL}/admin/managers/${id}`, manager);
  return response.data;
};

const deleteManager = async (id: string) => {
  const response = await axios.delete(`${API_URL}/admin/managers/${id}`);
  return response.data;
};

const updateReservationStatus = async (reservationId, status) => {
  const response = await axios.put(`${API_URL}/admin/reservations/${reservationId}`, {
    statut: status
  });
  return response.data;
};

const API = {
  loginAdmin,
  getReservations,
  getClients,
  getManagers,
  addManager,
  updateManager,
  deleteManager,
  updateReservationStatus
};

export default API;
