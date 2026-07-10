import axios from "axios";

// Axios instance centralizes the API base URL and auth token behavior.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

// Attach the saved JWT to every request once the user logs in.
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("luxeUser") || "null");

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

export default api;
