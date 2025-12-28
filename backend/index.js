const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const studentRoute = require("./routes/studentRoute");

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/MajorProject")
  .then(() => console.log("MongoDB connected to MajorProject"))
  .catch(console.log);

app.use("/api/register", studentRoute);

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
