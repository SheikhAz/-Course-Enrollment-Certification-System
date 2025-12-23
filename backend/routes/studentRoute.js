const router = require("express").Router();
const Student = require("../models/Student");
const Course = require("../models/Course");

/* ---------------- REGISTER STUDENT ---------------- */
router.post("/add", async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(200).json("Student registered successfully");
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
});

/* ---------------- LOGIN ---------------- */
router.post("/auth", async (req, res) => {
  try {
    const student = await Student.findOne({ email: req.body.email });
    if (!student || student.password !== req.body.password) {
      return res.status(400).json("Wrong credentials");
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json(error);
  }
});

/* ---------------- ADD / ENROLL COURSE ---------------- */
router.post("/course", async (req, res) => {
  const { registration, courses } = req.body;

  try {
    const existing = await Course.findOne({ registration });

    if (existing) {
      return res.status(400).json("Already enrolled");
    }

    const newCourse = new Course({ registration, courses });
    await newCourse.save();

    res.status(200).json("Courses enrolled");
  } catch (error) {
    res.status(500).json(error);
  }
});

/* ---------------- GET ALL AVAILABLE COURSES ---------------- */
router.get("/getcourses", async (req, res) => {
  try {
    const courses = await Course.find({}, { courses: 1, _id: 0 });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json(error);
  }
});

/* ---------------- GET USER ENROLLED COURSES ---------------- */
router.post("/getsecscourses", async (req, res) => {
  try {
    const course = await Course.findOne({
      registration: req.body.registration,
    });

    if (!course) {
      return res.status(404).json([]);
    }

    res.status(200).json(course.courses);
  } catch (error) {
    res.status(500).json(error);
  }
});

/* ---------------- DELETE SINGLE COURSE ---------------- */
router.delete("/delete", async (req, res) => {
  const { registration, name } = req.body;

  try {
    const updated = await Course.findOneAndUpdate(
      { registration },
      { $pull: { courses: name } },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json(error);
  }
});

/* ---------------- DELETE ALL COURSES ---------------- */
router.delete("/deleteall", async (req, res) => {
  try {
    await Course.findOneAndDelete({
      registration: req.body.registration,
    });

    res.status(200).json("All courses deleted");
  } catch (error) {
    res.status(500).json(error);
  }
});

/* ---------------- UPDATE COURSE ---------------- */
router.put("/update", async (req, res) => {
  const { registration, name, update } = req.body;

  try {
    const result = await Course.updateOne(
      { registration, courses: name },
      { $set: { "courses.$": update } }
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
