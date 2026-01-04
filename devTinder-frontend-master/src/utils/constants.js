const NODE_ENV = import.meta.env.MODE || "development";

export const BASE_URL =
  NODE_ENV === "development"
    ? "http://localhost:5000" // backend local server
    : "https://your-production-backend.com"; // replace with your deployed backend
