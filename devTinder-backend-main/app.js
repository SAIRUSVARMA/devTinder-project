const express = require("express");
const connectDB = require("./src/Config/database");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

// ⭐ CORS — allow local + prod
const allowedOrigins = [
  "http://localhost:5173",
  "https://devtinder-project-2.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("🔎 Request from origin:", origin);

      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ⭐ JSON + cookies
app.use(express.json());
app.use(cookieParser());

// ⭐ Helmet
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

// ⭐ Routes
app.use("/", require("./src/routes/auth"));
app.use("/", require("./src/routes/profile"));
app.use("/", require("./src/routes/request"));
app.use("/", require("./src/routes/user"));

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server started on ${PORT}`));
});
