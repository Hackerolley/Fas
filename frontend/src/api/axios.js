import axios from "axios";

// An explicit build-time URL wins. The production fallback keeps protected admin
// requests on the API when a Vercel environment variable has not been configured.
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, "");
const apiBaseUrl = configuredApiUrl || (
  import.meta.env.DEV
    ? "http://localhost:5000/api"
    : "https://froyalamitystore.onrender.com/api"
);

// Axios instance centralizes the API base URL and auth token behavior.
const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true
});

// The cookie is primary; the persisted bearer token supports browsers that block cross-site cookies.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("Froyal AmityAccessToken") || sessionStorage.getItem("Froyal AmityAccessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
