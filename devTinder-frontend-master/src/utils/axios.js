import axios from "axios";
import { BASE_URL } from "./constants";

// Create a single axios instance
const api = axios.create({
  baseURL: BASE_URL, // automatically uses dev or prod URL
  withCredentials: true, // sends cookies automatically
});

export default api;
