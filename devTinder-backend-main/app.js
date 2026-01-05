const express = require("express");
const connectDB = require("./src/Config/database");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

// ⭐ CORS — MUST BE THIS
app.use(
  cors({
    origin: "https://devtinder-project-2.onrender.com",
    credentials: true,
  })
);

// ⭐ JSON + cookies
app.use(express.json());
app.use(cookieParser());

// ⭐ Helmet (simplified so it won't block)
app.use(
  helmet({
    contentSecurityPolicy: false,
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
