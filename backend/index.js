const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const studentRoute = require("./routes/studentRoute");

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/register", studentRoute);

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
  