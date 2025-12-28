const mongoose = require("mongoose"); // ✅ REQUIRED

const EnrollmentSchema = new mongoose.Schema(
  {
    registration: {
      type: String,
      required: true,
      unique: true,
    },
    courses: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enrollment", EnrollmentSchema);
