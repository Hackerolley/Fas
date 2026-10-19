import axios from "axios";

// An explicit build-time URL wins. Production uses Vercel's same-origin API proxy
// so browsers send the HttpOnly session cookie reliably.
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, "");
const apiBaseUrl = configuredApiUrl || (
  import.meta.env.DEV
    ? "http://localhost:5000/api"
    : "/api"
);

// Axios instance centralizes the API base URL and auth token behavior.
const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true
});

export default api;
