import express from "express";
import Enrollment from "../models/Enrollment.js";
import Student from "../models/Student.js";

const router = express.Router();

/* =====================================================
   GET ALL ENROLLMENTS (ADMIN)
   ===================================================== */
router.get("/enrollments", async (req, res) => {
  try {
    const enrollments = await Enrollment.find();

    res.status(200).json(enrollments);
  } catch (err) {
    res.status(500).json({
      message: "Failed to load enrollments",
      error: err.message,
    });
  }
});

/* =====================================================
   ISSUE CERTIFICATE (ADMIN)
   ===================================================== */
router.put("/issue-certificate", async (req, res) => {
  const { enrollmentId, courseName } = req.body;

  try {
    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    const course = enrollment.courses.find((c) => c.courseName === courseName);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.certificateIssued = true;
    course.status = "completed";

    await enrollment.save();

    res.status(200).json({
      message: "Certificate issued successfully",
      enrollment,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to issue certificate",
      error: err.message,
    });
  }
});
router.get("/stats", async (req, res) => {
  try {
    const totalEnrollments = await Enrollment.countDocuments();

    const completedCourses = await Enrollment.countDocuments({
      "courses.status": "completed",
    });

    const completionRate =
      totalEnrollments === 0
        ? 0
        : Math.round((completedCourses / totalEnrollments) * 100);

    res.json({
      totalEnrollments,
      completedCourses,
      completionRate,
    });
  } catch (err) {
    res.status(500).json({ message: "Stats error" });
  }
});


export default router;
