import axios from "axios";
import { BASE_URL } from "./constants";

// Create a single axios instance
const api = axios.create({
  baseURL: "https://devtinder-project-1.onrender.com",
  withCredentials: true, // sends cookies automatically
});

export default api;
