import express from "express";
import Enrollment from "../models/Enrollment.js";
import Certificate from "../models/Certificate.js";

const router = express.Router();

/* ISSUE CERTIFICATE */
router.post("/issue-certificate/:enrollmentId", async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.enrollmentId)
      .populate("student")
      .populate("course");

    if (!enrollment || enrollment.status !== "completed") {
      return res.status(400).json("Course not completed");
    }

    if (enrollment.certificateIssued) {
      return res.status(400).json("Certificate already issued");
    }

    const certificate = new Certificate({
      student: enrollment.student._id,
      course: enrollment.course._id,
      enrollment: enrollment._id,
      certificateId: `CERT-${Date.now()}`,
    });

    enrollment.certificateIssued = true;
    enrollment.certificateIssuedAt = new Date();

    await certificate.save();
    await enrollment.save();

    res.status(201).json(certificate);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

/* ADMIN STATS */
router.get("/stats", async (req, res) => {
  try {
    const total = await Enrollment.countDocuments();
    const completed = await Enrollment.countDocuments({
      status: "completed",
    });

    res.json({
      totalEnrollments: total,
      completedCourses: completed,
      completionRate: ((completed / total) * 100).toFixed(2),
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});
router.get("/enrollments", async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("student")
      .populate("course");

    res.json(enrollments);
  } catch (err) {
    res.status(500).json(err.message);
  }
});


export default router;
