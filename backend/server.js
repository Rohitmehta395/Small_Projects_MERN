require("dotenv").config();
const express = require("express");
const app = express();

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Home");
});

app.listen(PORT, (req, res) => {
  console.log(`Server is listening on ${PORT}`);
});
