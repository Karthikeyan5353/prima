import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
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
