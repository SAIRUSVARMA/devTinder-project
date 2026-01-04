const express = require("express");
const connectDB = require("./src/Config/database");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");

dotenv.config(); // load .env
const app = express();

// Use NODE_ENV and PORT from .env or defaults
const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 5000;

// ✅ Middleware: CORS
// Allow frontend origin in dev, or your deployed frontend in prod
const FRONTEND_ORIGIN =
  NODE_ENV === "development"
    ? "http://localhost:5173" // Vite frontend
    : "https://your-production-frontend.com";

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);

// ✅ Middleware: JSON and cookies
app.use(express.json());
app.use(cookieParser());

// ✅ Helmet CSP
if (NODE_ENV === "development") {
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          "http://localhost:5000", // backend API
          "http://127.0.0.1:5000", // fallback for local dev
          "http://localhost:5173", // frontend dev
          "ws://localhost:5173", // Vite HMR WebSocket
        ],
        scriptSrc: ["'self'", "'unsafe-inline'", "blob:"], // ✅ allow Vite injected scripts
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
      },
    })
  );
} else {
  // Production: stricter CSP
  const BACKEND_PROD = "https://your-production-backend.com"; // replace with your deployed backend
  const FRONTEND_PROD = "https://your-production-frontend.com"; // replace with deployed frontend
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [BACKEND_PROD, FRONTEND_PROD],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", "data:"],
      },
    })
  );
}

// ✅ Routes
app.use("/", require("./src/routes/auth"));
app.use("/", require("./src/routes/profile"));
app.use("/", require("./src/routes/request"));
app.use("/", require("./src/routes/user"));

// ✅ Database connect and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
    });
  })
  .catch((err) => console.log("DB connection failed:", err));
