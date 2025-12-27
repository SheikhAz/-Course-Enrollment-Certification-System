const router = require("express").Router();

const Student = require("../models/Student");
const Course = require("../models/Course"); // ✅ master courses
const Enrollment = require("../models/Enrollment"); // ✅ enrolled courses
const {
  createIndexes,
  findByIdAndUpdate,
  findByIdAndDelete,
} = require("../models/Student");

router.post("/add", async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    const savedStudent = await newStudent.save();
    res.status(200).json({ savedStudent });
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
});

router.post("/course", async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    const savedCourse = await newCourse.save();
    res.status(200).json({ savedCourse });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/auth", async (req, res) => {
  try {
    // console.log('inside try');
    const student = await Student.findOne({ email: req.body.email });

    // console.log(student);
    !student &&
      res.status(400).json({
        message: "Wrong Credentials",
        success: false,
      });
    if (student) {
      // console.log('inside if');
      const validated = req.body.password === student.password;
      // console.log(validated)
      if (!validated) {
        res.status(400).json({
          message: "Wrong Credentials",
          success: false,
        });
      } else {
        res.status(200).json(student);
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/addcourse", async (req, res) => {
  try {
    const newCourse = new Cours(req.body);
    const savedCours = await newCourse.save();

    res.status(200).json(savedCours);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/getcourses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/getsecscourses", async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      registration: req.body.registration,
    });

    if (!enrollment) {
      return res.status(404).json([]);
    }

    res.status(200).json(enrollment.courses);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const updated = await Enrollment.findOneAndUpdate(
      { registration: req.body.registration },
      { $pull: { courses: req.body.name } },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/deleteall", async (req, res) => {
  try {
    await Enrollment.findOneAndDelete({
      registration: req.body.registration,
    });
    res.status(200).json("All courses deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/update", async (req, res) => {
  try {
    const updated = await Enrollment.findOneAndUpdate(
      {
        registration: req.body.registration,
        courses: req.body.name,
      },
      {
        $set: { "courses.$": req.body.update },
      },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
