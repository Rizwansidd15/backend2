// create server

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.route");
const foodRoutes = require('./routes/food.route')
const cors = require('cors')
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());



app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes)

module.exports = app;
