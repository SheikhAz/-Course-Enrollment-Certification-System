import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import registerRoutes from "./routes/studentRoute.js";
import enrollmentRoutes from "./routes/enrollment.js";
import adminRoutes from "./routes/admin.js";
import certificateRoutes from "./routes/certificate.js";

dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= ROUTES ================= */
app.use("/api/register", registerRoutes);
app.use("/api/enrollment", enrollmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/certificates", certificateRoutes);

/* ================= DATABASE ================= */
mongoose
  .connect("mongodb://127.0.0.1:27017/MajorProject")
  .then(() => console.log("MongoDB connected to MajorProject"))
  .catch(console.log);

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
