import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    courseCode: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    collection: "courses",
    timeseries: true,
    read: "nearest",
    writeConcern: {
      w: "majority",
      j: true,
      wtimeoutMS: 30000,
    },
    timestamps: true,
  }
);

const CourseModel = mongoose.model("Course", courseSchema);

export default CourseModel;