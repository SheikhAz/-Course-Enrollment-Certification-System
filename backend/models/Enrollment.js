const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema({
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

module.exports = mongoose.model("Enrollment", EnrollmentSchema);
