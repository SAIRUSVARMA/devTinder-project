const express = require("express");
const connectDB = require("./src/Config/database");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path"); // ⭐ ADD THIS

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

// ------------------------------------
// ⭐ CORS — allow local dev only
// (production will be same-origin)
// ------------------------------------
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ------------------------------------
// ⭐ JSON + cookies
// ------------------------------------
app.use(express.json());
app.use(cookieParser());

// ------------------------------------
// ⭐ Helmet (safe)
// ------------------------------------
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

// ------------------------------------
// ⭐ API ROUTES (UNCHANGED)
// ------------------------------------
app.use("/", require("./src/routes/auth"));
app.use("/", require("./src/routes/profile"));
app.use("/", require("./src/routes/request"));
app.use("/", require("./src/routes/user"));

// ------------------------------------
// ⭐ SERVE FRONTEND (PRODUCTION ONLY)
// ------------------------------------
if (process.env.NODE_ENV === "production") {
  const __dirname1 = path.resolve();

  app.use(express.static(path.join(__dirname1, "frontend", "dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"));
  });
}

// ------------------------------------
// ⭐ START SERVER
// ------------------------------------
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server started on ${PORT}`));
});
