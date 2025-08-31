const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cryptoRoutes = require("./routes/cryptoRoutes");
const cors = require("cors");

app.use(cors());
app.use("/api", cryptoRoutes);

module.exports = app;
