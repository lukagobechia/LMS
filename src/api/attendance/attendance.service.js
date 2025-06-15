import AttendanceModel from "./attendance.model.js";
import LessonModel from "../lesson/lesson.model.js";
import CourseModel from "../course/course.model.js";

export const submitAttendance = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const updates = req.body;

    const lesson = await LessonModel.findById(lessonId).populate("course");
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found." });
    }

    const results = await Promise.all(
      updates.map(async ({ studentId, present }) => {
        return await AttendanceModel.findOneAndUpdate(
          { student: studentId, lesson: lessonId },
          {
            student: studentId,
            lesson: lessonId,
            course: lesson.course._id,
            present,
          },
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
          }
        );
      })
    );

    res.status(200).json({ message: "Attendance updated", data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


export const getMyAttendance = async (req, res) => {
  try {
    const studentId = req.user.userId;

    const attendance = await AttendanceModel.find({ student: studentId })
      .populate({ path: "course", select: "_id courseCode title category" })
      .populate({ path: "lesson", select: "_id title" })
      .sort({ "lesson.date": -1 });

    // Group by course
    const grouped = {};

    for (const record of attendance) {
      const courseId = record.course._id.toString();

      if (!grouped[courseId]) {
        grouped[courseId] = {
          course: record.course,
          records: [],
        };
      }

      grouped[courseId].records.push({
        _id: record._id,
        lesson: record.lesson,
        present: record.present,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      });
    }

    const groupedArray = Object.values(grouped);

    res.status(200).json({ data: groupedArray });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getCourseAttendance = async (req, res) => {
  try {
    const { courseId } = req.params;
    // Check if course exists
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    const attendance = await AttendanceModel.find({ course: courseId })
      .populate({ path: "course", select: "_id courseCode title category" })
      .populate({ path: "lesson", select: "_id title" })
      .populate({ path: "student", select: "_id firstName lastName" })
      .sort({ "lesson.date": -1 });

    res.status(200).json({ data: attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getLessonAttendance = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const lesson = await LessonModel.findById(lessonId).populate("course");
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found." });
    }

    const attendance = await AttendanceModel.find({ lesson: lessonId })
      .populate({ path: "student", select: "_id firstName lastName" })
      .populate({ path: "course", select: "_id courseCode title category" })
      .populate({ path: "lesson", select: "_id title date" });

    res.status(200).json({ data: attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};