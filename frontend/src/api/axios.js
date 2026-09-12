import axios from "axios";

// Axios instance centralizes the API base URL and auth token behavior.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

export default api;
