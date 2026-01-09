import axios from "axios";

// Single axios instance for the whole app
const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000" // local backend
      : "/", // SAME DOMAIN in production
  withCredentials: true, // send cookies
});

export default api;
