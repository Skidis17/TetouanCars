const API_BASE_URL = 'http://localhost:5000';

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  IMAGE_URL: `${API_BASE_URL}/admin/image`,
  VOITURES: `${API_BASE_URL}/admin/voiture`,
  RESERVATIONS: `${API_BASE_URL}/admin/reservations`,
  CLIENTS: `${API_BASE_URL}/admin/clients`,
  MANAGERS: `${API_BASE_URL}/admin/managers`,
};

export default API_ENDPOINTS; 