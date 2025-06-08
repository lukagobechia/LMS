import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
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
    enrolledAt: { type: Date, default: Date.now },
  },
  {
    collection: "enrollments",
    versionKey: false,
    timestamps: false,
    read: "nearest",
    writeConcern: {
      w: "majority",
      j: true,
      wtimeoutMS: 30000,
    },
  }
);

/** ▸ A student can appear only once per course */
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

export const EnrollmentModel = mongoose.model("Enrollment", enrollmentSchema);
export default EnrollmentModel;
