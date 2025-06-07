import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true },
    description: { type: String },
    content: { type: [String], default: [] },
    order: { type: Number, required: true },
  },
  {
    timestamps: true,
    collection: "lessons",
    read: "nearest",
    writeConcern: {
      w: "majority",
      j: true,
      wtimeoutMS: 30000,
    },
  }
);

const LessonModel = mongoose.model("Lesson", lessonSchema);

export default LessonModel;