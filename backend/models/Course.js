const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  registration: {
    type: String,
    required: true,
    unique: true,
  },
  courses: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("Course", CourseSchema);
