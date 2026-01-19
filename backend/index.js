import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import registerRoutes from "./routes/studentRoute.js";
import enrollmentRoutes from "./routes/enrollment.js";
import adminRoutes from "./routes/admin.js";
import certificateRoutes from "./routes/certificate.js";
import adminCertificateRoutes from "./routes/adminCertificateRoutes.js";

dotenv.config();

const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* ROUTES */

// Student routes
app.use("/api/register", registerRoutes);
app.use("/api/enrollment", enrollmentRoutes);
app.use("/api/certificates", certificateRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);
app.use("/api/admin/certificates", adminCertificateRoutes);

/* DATABASE */
mongoose
  .connect("mongodb://127.0.0.1:27017/MajorProject")
  .then(() => console.log("MongoDB connected to MajorProject"))
  .catch((err) => console.error("MongoDB error:", err));

/* SERVER */
app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
