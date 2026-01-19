import express from "express";
import Enrollment from "../models/Enrollment.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= STUDENT – DOWNLOAD CERTIFICATE ================= */
router.get("/download/:enrollmentId", authMiddleware, async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.enrollmentId);

  if (
    !enrollment ||
    !enrollment.certificateIssued ||
    enrollment.student.toString() !== req.user.id
  ) {
    return res.status(403).json({ message: "Access denied" });
  }

  res.download(enrollment.certificateUrl);
});


export default router;
