const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cryptoRoutes = require("./routes/cryptoRoutes");
const cors = require("cors");
app.set("trust proxy", 1);

app.use(cors());
app.use("/api", cryptoRoutes);

module.exports = app;
