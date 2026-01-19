import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/isAdmin.js";
import upload from "../middleware/certificateUpload.js";
import { uploadCertificate } from "../controllers/certificateController.js";

const router = express.Router();

/* ================= ADMIN – ISSUE & UPLOAD CERTIFICATE ================= */
router.post(
  "/upload",
  authMiddleware,
  isAdmin,
  upload.single("certificate"),
  uploadCertificate,
);

export default router;
