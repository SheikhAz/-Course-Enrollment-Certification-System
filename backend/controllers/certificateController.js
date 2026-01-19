import Enrollment from "../models/Enrollment.js";

export const uploadCertificate = async (req, res) => {
  try {
    const { registration, courseName } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Certificate file required" });
    }

    const enrollment = await Enrollment.findOne({ registration });

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    const course = enrollment.courses.find((c) => c.courseName === courseName);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.status !== "completed") {
      return res.status(400).json({ message: "Course not completed" });
    }

    // 🔴 ADD THIS
    if (course.certificateIssued) {
      return res.status(400).json({ message: "Certificate already issued" });
    }

    course.certificateIssued = true;
    course.certificateUrl = req.file.path;
    await enrollment.save();

    res.status(200).json({
      message: "Certificate uploaded successfully",
      certificateUrl: course.certificateUrl,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
