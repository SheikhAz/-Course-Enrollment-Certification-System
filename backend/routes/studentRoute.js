import express from "express";
import bcrypt from "bcryptjs";
import Student from "../models/Student.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import jwt from "jsonwebtoken";

const router = express.Router();

/* ================= STUDENT REGISTER ================= */
router.post("/add", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      address,
      registration,
      role,
      adminKey,
    } = req.body;

    // 🔐 Admin secret key validation
    if (role === "admin") {
      if (adminKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(403).json("Invalid Admin Secret Key");
      }
    }

    // 🔒 Password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const student = new Student({
      name,
      email,
      phone,
      password: hashedPassword,
      address,
      registration: role === "admin" ? null : registration,
      userType: role === "admin" ? "admin" : "user",
    });

    await student.save();

    res.status(201).json({
      success: true,
      student,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ================= STUDENT LOGIN ================= */
router.post("/auth", async (req, res) => {
  try {
    const { email, password, role, adminKey } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json("User not found");
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json("Invalid credentials");
    }

    // 🔐 Admin login validation
    if (role === "admin") {
      if (student.userType !== "admin") {
        return res.status(403).json("Not an admin account");
      }

      if (adminKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(403).json("Invalid Admin Secret Key");
      }
    }

    // 🔑 CREATE JWT TOKEN
    const token = jwt.sign(
      {
        id: student._id,
        role: student.userType, // admin or user
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // ✅ SEND TOKEN TO FRONTEND
    res.status(200).json({
      success: true,
      token,
      student,
    });
  } catch (err) {
    res.status(500).json("Server error");
  }
});

/* ================= GET ALL COURSES ================= */
router.get("/getcourses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ================= ENROLL COURSE ================= */
router.post("/course", async (req, res) => {
  const { registration, course } = req.body;

  if (!registration || !course) {
    return res.status(400).json({
      success: false,
      message: "Missing data",
    });
  }

  try {
    let enrollment = await Enrollment.findOne({ registration });

    if (!enrollment) {
      enrollment = new Enrollment({
        registration,
        courses: [
          {
            courseName: course,
            status: "enrolled",
            certificateIssued: false,
          },
        ],
      });
    } else {
      const alreadyEnrolled = enrollment.courses.find(
        (c) => c.courseName === course
      );

      if (alreadyEnrolled) {
        return res.status(400).json({
          success: false,
          message: "Course already enrolled",
        });
      }

      enrollment.courses.push({
        courseName: course,
        status: "enrolled",
        certificateIssued: false,
      });
    }

    await enrollment.save();

    res.status(200).json({
      success: true,
      courses: enrollment.courses,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ================= GET USER ENROLLED COURSES ================= */
router.post("/getsecscourses", async (req, res) => {
  const { registration } = req.body;

  if (!registration) {
    return res.status(400).json({
      success: false,
      message: "Registration missing",
    });
  }

  try {
    const enrollment = await Enrollment.findOne({ registration });

    res.status(200).json({
      courses: enrollment ? enrollment.courses : [],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ================= DELETE ONE COURSE ================= */
router.delete("/delete", async (req, res) => {
  const { registration, name } = req.body;

  try {
    const updated = await Enrollment.findOneAndUpdate(
      { registration },
      { $pull: { courses: { courseName: name } } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      courses: updated.courses,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ================= DELETE ALL COURSES ================= */
router.delete("/deleteall", async (req, res) => {
  const { registration } = req.body;

  try {
    await Enrollment.findOneAndUpdate(
      { registration },
      { $set: { courses: [] } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      courses: [],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ================= UPDATE COURSE ================= */
router.put("/update", async (req, res) => {
  const { registration, name, update } = req.body;

  try {
    const updated = await Enrollment.findOneAndUpdate(
      { registration, "courses.courseName": name },
      { $set: { "courses.$.courseName": update } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      courses: updated.courses,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
