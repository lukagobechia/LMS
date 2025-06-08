import mongoose from "mongoose";

const lessonProgressSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: "lesson_progress" }
);

const LessonProgress = mongoose.model("LessonProgress", lessonProgressSchema);

export default LessonProgress;
