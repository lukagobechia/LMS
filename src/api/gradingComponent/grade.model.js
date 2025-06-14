import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    component: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GradingComponent",
      required: true,
    },
    score: { type: Number, required: true },
    gradedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
    collection: "grades",
    read: "nearest",
    writeConcern: {
      w: "majority",
      j: true,
      wtimeoutMS: 30000,
    },
  }
);

export default mongoose.model("Grade", gradeSchema);
