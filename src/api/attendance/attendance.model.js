import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  present: { type: Boolean, required: true },
  timestamp: { type: Date, default: Date.now }
},
{
    collection: "attendance",
    timestamps: true,
    read: "nearest",
    writeConcern: {
      w: "majority",
      j: true,
      wtimeoutMS: 30000,
    },
  }
);

const AttendanceSchema = mongoose.model("Attendance", attendanceSchema);

export default AttendanceSchema;