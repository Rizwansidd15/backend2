// create server

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.route");
const foodRoutes = require("./routes/food.route");
const cors = require("cors");
const allowedOrigins = [
  "https://frontend-nu-orcin-43.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);

module.exports = app;
