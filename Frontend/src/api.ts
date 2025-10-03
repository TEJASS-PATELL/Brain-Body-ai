import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000", // fallback
  withCredentials: true, // ✅ send cookies (JWT) with requests
  headers: {
    "Content-Type": "application/json", // ensure JSON payload
  },
});

// Optional: response interceptor for debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
