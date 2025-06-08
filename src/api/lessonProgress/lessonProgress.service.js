import LessonModel from "../lesson/lesson.model.js";
import LessonProgress from "./lessonProgress.model.js";

export const markLessonComplete = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const lessonId = req.params.lessonId;

    const lesson = await LessonModel.findById(lessonId).populate("course");
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const existing = await LessonProgress.findOne({
      student: studentId,
      lesson: lessonId,
    });
    if (existing)
      return res.status(400).json({ message: "Already marked as complete" });

    const progress = await LessonProgress.create({
      student: studentId,
      lesson: lesson._id,
      course: lesson.course._id,
    });

    res
      .status(201)
      .json({ message: "Lesson marked as completed", data: progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unmarkLessonComplete = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const lessonId = req.params.lessonId;

    const lesson = await LessonModel.findById(lessonId).populate("course");
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const progress = await LessonProgress.findOneAndDelete({
      student: studentId,
      lesson: lessonId,
    });

    if (!progress) {
      return res
        .status(404)
        .json({ message: "Progress not found or already unmarked" });
    }

    res.status(200).json({ message: "Lesson unmarked as completed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyProgressGroupedByCourse = async (req, res) => {
  try {
    const studentId = req.user.userId;

    const progress = await LessonProgress.find({ student: studentId })
      .populate("lesson", "title order")
      .populate("course", "courseCode title category")
      .sort({ "lesson.order": 1 });

    if (!progress || progress.length === 0) {
      return res.status(200).json({ data: [] });
    }

    const grouped = progress.reduce((acc, item) => {
      const courseId = item.course._id.toString();
      if (!acc[courseId]) {
        acc[courseId] = {
          course: item.course,
          records: [],
        };
      }
      acc[courseId].records.push({
        _id: item._id,
        lesson: item.lesson,
        completedAt: item.completedAt,
      });
      return acc;
    }, {});

    const result = Object.values(grouped);

    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
