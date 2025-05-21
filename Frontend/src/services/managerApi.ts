import axios from "axios";

const API_URL = "http://localhost:5000/";

// Reservations
export const getReservations = async () => {
  const response = await axios.get(`${API_URL}manager/reservations`, {
    params: { populate: "client_id,voiture_id" }
  });
  return response.data;
};

export const updateReservationStatus = async (id: string, status: string) => {
  const response = await axios.patch(`${API_URL}manager/reservations/${id}`, { statut: status });
  return response.data;
};

export const updatePaymentStatus = async (id: string, paymentData: any) => {
  const response = await axios.patch(`${API_URL}manager/reservations/${id}`, {
    paiement: paymentData
  });
  return response.data;
};

export const deleteReservation = async (id: string) => {
  const response = await axios.delete(`${API_URL}manager/reservations/${id}`);
  return response.data;
};

// Clients
export const getClients = async () => {
  const response = await axios.get(`${API_URL}manager/clients`);
  return response.data;
};

// Voitures
export const getVoitures = async () => {
  const response = await axios.get(`${API_URL}manager/voitures`);
  return response.data;
};


const API = {
  getReservations,
  getClients,
  getVoitures,
  updateReservationStatus,
  updatePaymentStatus,
  deleteReservation
};

export default API;