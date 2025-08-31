const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cryptoRoutes = require("./routes/cryptoRoutes");
const cors = require("cors");
app.set("trust proxy", 1);

app.use(cors());
app.use((req, res, next) => {
  console.log("req.protocol:", req.protocol);
  console.log("X-Forwarded-Proto:", req.headers["x-forwarded-proto"]);
  console.log("Host:", req.get("host"));
  next();
});

app.use("/api", cryptoRoutes);

module.exports = app;
