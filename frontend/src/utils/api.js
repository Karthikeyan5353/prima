import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API + "/api",
});

api.interceptors.request.use((config) => {
  const session =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(localStorage.getItem("admin"));

  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }

  return config;
});

export default api;
