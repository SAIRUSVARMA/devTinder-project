const express = require("express");
const connectDB = require("./src/Config/database");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");

dotenv.config();
const app = express();

const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 5000;

// --------------------
// ⭐ CORS CONFIG
// --------------------
app.use(
  cors({
    origin: process.env.CLIENT_URL, // <-- IMPORTANT
    credentials: true,
  })
);

// --------------------
// ⭐ JSON + Cookies
// --------------------
app.use(express.json());
app.use(cookieParser());

// --------------------
// ⭐ SECURITY (HELMET)
// --------------------
if (NODE_ENV === "development") {
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          process.env.CLIENT_URL || "http://localhost:5173",
          "ws://localhost:5173",
          "http://localhost:5000",
        ],
        scriptSrc: ["'self'", "'unsafe-inline'", "blob:"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
      },
    })
  );
} else {
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [process.env.CLIENT_URL, process.env.BACKEND_URL],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", "data:"],
      },
    })
  );
}

// --------------------
// ⭐ ROUTES
// --------------------
app.use("/", require("./src/routes/auth"));
app.use("/", require("./src/routes/profile"));
app.use("/", require("./src/routes/request"));
app.use("/", require("./src/routes/user"));

// --------------------
// ⭐ START SERVER AFTER DB
// --------------------
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
    });
  })
  .catch((err) => console.log("DB connection failed:", err));
