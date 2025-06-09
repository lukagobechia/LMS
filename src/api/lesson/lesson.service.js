import LessonModel from "./lesson.model.js";
import EnrollmentModel from "../enrollment/enrollment.model.js";
import AttendanceModel from "../attendance/attendance.model.js";

export const addLesson = async (lessonData) => {
  const lesson = new LessonModel(lessonData);
  await lesson.save();

  const enrolledStudents = await EnrollmentModel.find({ course: lesson.course }).select("student");

  const attendanceEntries = enrolledStudents.map(({ student }) => ({
    student,
    course: lesson.course,
    lesson: lesson._id,
    present: false
  }));

  if (attendanceEntries.length > 0) {
    await AttendanceModel.insertMany(attendanceEntries);
  }

  return lesson;
};

export const getAllLessons = async () => {
  return await LessonModel.find().sort("order");
};

export const getLessonById = async (lessonId) => {
  const lesson = await LessonModel.findById(lessonId).populate("course");
  return lesson;
};

export const getLessonsByCourse = async (courseId) => {
  return LessonModel.find({ course: courseId }).sort("order");
};

export const updateLesson = async (lessonId, updateData) => {
  const updated = await LessonModel.findByIdAndUpdate(lessonId, updateData, { new: true });
  if (!updated) throw new Error("Lesson not found");
  return updated;
};

export const deleteLesson = async (lessonId) => {
  const deleted = await LessonModel.findByIdAndDelete(lessonId);
  if (!deleted) throw new Error("Lesson not found");
  return deleted;
};