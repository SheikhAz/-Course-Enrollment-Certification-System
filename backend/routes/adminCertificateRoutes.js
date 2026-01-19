import express from "express";
import Certificate from "../models/Certificate.js";
import Enrollment from "../models/Enrollment.js";
import authMiddleware from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

/* ================= ADMIN – VIEW ALL CERTIFICATES ================= */
router.get("/certificates", authMiddleware, isAdmin, async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .populate("student", "name registration")
      .populate("course", "courseName")
      .sort({ issuedAt: -1 });

    res.status(200).json(certificates);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch certificates",
      error: err.message,
    });
  }
});

/* ================= ADMIN – ISSUE CERTIFICATE ================= */
router.post("/issue-certificate", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { enrollmentId } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId)
      .populate("student")
      .populate("course");

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    const existing = await Certificate.findOne({
      enrollment: enrollmentId,
    });

    if (existing) {
      return res.status(400).json({ message: "Certificate already issued" });
    }

    const certificate = new Certificate({
      enrollment: enrollment._id,
      student: enrollment.student._id,
      course: enrollment.course._id,
      issuedBy: req.user.id,
      issuedAt: new Date(),
    });

    await certificate.save();

    enrollment.certificateIssued = true;
    enrollment.status = "completed";
    await enrollment.save();

    res.status(201).json({
      message: "Certificate issued successfully",
      certificate,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to issue certificate",
      error: err.message,
    });
  }
});

/* ================= EXPORT (THIS WAS MISSING) ================= */
export default router;
