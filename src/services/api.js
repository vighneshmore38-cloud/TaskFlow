import axios from "axios";
import { STORAGE_KEYS } from "../utils/constants";

// Single Axios instance the whole app shares.
// When the backend is ready, set VITE_API_BASE_URL in a .env file, e.g.
//   VITE_API_BASE_URL=https://api.yourcompany.com/api
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attaches the stored auth token to every outgoing request automatically,
// once the backend issues real JWT/session tokens on login.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized response handling — e.g. auto-logout on 401 once a backend exists.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
    return Promise.reject(error);
  }
);

export default api;
