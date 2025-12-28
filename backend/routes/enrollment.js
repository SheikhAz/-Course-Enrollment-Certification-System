import express from "express";
import Enrollment from "../models/Enrollment.js";

const router = express.Router();

/* =========================================================
   UPDATE COURSE PROGRESS (LESSON COMPLETION)
   ========================================================= */

router.put("/update-progress/:id", async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        message: "Enrollment not found",
      });
    }

    // Prevent updating after completion
    if (enrollment.status === "completed") {
      return res.status(400).json({
        message: "Course already completed",
      });
    }

    // Increment completed lessons
    enrollment.progress.completedLessons += 1;

    // Safety check
    if (
      enrollment.progress.completedLessons > enrollment.progress.totalLessons
    ) {
      enrollment.progress.completedLessons = enrollment.progress.totalLessons;
    }

    // Calculate percentage
    enrollment.progress.percentage = Math.round(
      (enrollment.progress.completedLessons /
        enrollment.progress.totalLessons) *
        100
    );

    // Update status
    enrollment.status =
      enrollment.progress.percentage === 100 ? "completed" : "in-progress";

    await enrollment.save();

    res.status(200).json({
      message: "Progress updated successfully",
      enrollment,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update progress",
      error: err.message,
    });
  }
});

/* =========================================================
   GET USER ENROLLMENTS (STUDENT DASHBOARD)
   ========================================================= */

router.get("/user/:userId", async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.params.userId,
    }).populate("course");

    res.status(200).json(enrollments);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch enrollments",
      error: err.message,
    });
  }
});

/* =========================================================
   GET SINGLE ENROLLMENT (CERTIFICATE VIEW)
   ========================================================= */

router.get("/:id", async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate("student")
      .populate("course");

    if (!enrollment) {
      return res.status(404).json({
        message: "Enrollment not found",
      });
    }

    res.status(200).json(enrollment);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch enrollment",
      error: err.message,
    });
  }
});

export default router;
