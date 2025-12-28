import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Course", CourseSchema);
