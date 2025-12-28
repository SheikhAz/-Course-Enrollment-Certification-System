const router = require("express").Router();
const Student = require("../models/Student");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

/* ================= STUDENT REGISTER ================= */
router.post("/add", async (req, res) => {
  try {
    const student = new Student(req.body);
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
  const email = req.body.email?.trim();
  const password = req.body.password?.trim();

  try {
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (student.password !== password) {
      return res.status(400).json({
        success: false,
        message: "Wrong password",
      });
    }

    res.status(200).json({
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
/*
BODY:
{
  registration: "PLKJHU",
  course: "Database Management Systems"
}
*/
router.post("/course", async (req, res) => {
  const { registration, course } = req.body;
  console.log("COURSE API BODY:", req.body); // 👈 ADD THIS

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
        courses: [course],
      });
    } else {
      if (enrollment.courses.includes(course)) {
        return res.status(400).json({
          success: false,
          message: "Course already enrolled",
        });
      }
      enrollment.courses.push(course);
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
      { $pull: { courses: name } },
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
    const updated = await Enrollment.findOneAndUpdate(
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
      { registration, courses: name },
      { $set: { "courses.$": update } },
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

module.exports = router;
