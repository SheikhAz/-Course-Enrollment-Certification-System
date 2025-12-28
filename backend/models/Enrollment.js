import mongoose from "mongoose";

const EnrollmentSchema = new mongoose.Schema(
  {
    registration: {
      type: String,
      required: true,
    },
    courses: [
      {
        courseName: String,
        status: {
          type: String,
          default: "enrolled", // enrolled | in-progress | completed
        },
        certificateIssued: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Enrollment", EnrollmentSchema);
