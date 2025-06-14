import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["File", "Quiz", "Video"],
    required: true,
  },
  value: {
    type: mongoose.Schema.Types.ObjectId,
    required: function () {
      return this.type !== "Video";
    },
    refPath: "content.type",
  },
  url: {
    type: String,
    required: function () {
      return this.type === "Video";
    },
  },
});

const lessonSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    content: { type: [contentSchema], default: [] },
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
