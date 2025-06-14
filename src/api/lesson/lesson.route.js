import { Router } from "express";
import {
  addLesson,
  getAllLessons,
  getLessonById,
  getLessonsByCourse,
  updateLesson,
  deleteLesson,
  addLessonContent,
} from "./lesson.service.js";
import { authGuard } from "../../middlewares/auth.middleware.js";
import { roleGuard } from "../../middlewares/role.middleware.js";
import multer from "multer";
import QuizRouter from "./quiz/quiz.route.js";

const LessonRouter = Router();

const upload = multer({ storage: multer.memoryStorage() });

LessonRouter.post("/", authGuard, roleGuard("instructor"), async (req, res) => {
  try {
    const lessonData = req.body;
    const lesson = await addLesson(lessonData);
    res.status(201).json({ message: "Lesson added", data: lesson });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

LessonRouter.get("/all", async (req, res) => {
  try {
    const lessons = await getAllLessons();
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

LessonRouter.get("/:lessonId", async (req, res) => {
  try {
    const lesson = await getLessonById(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

LessonRouter.get("/", async (req, res) => {
  try {
    const courseId = req.query.courseId;
    if (!courseId) {
      return res
        .status(400)
        .json({ message: "courseId query parameter required" });
    }
    const lessons = await getLessonsByCourse(courseId);
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

LessonRouter.put(
  "/:lessonId",
  authGuard,
  roleGuard("instructor"),
  async (req, res) => {
    try {
      const updated = await updateLesson(req.params.lessonId, req.body);
      res.status(200).json({ message: "Lesson updated", data: updated });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

LessonRouter.delete(
  "/:lessonId",
  authGuard,
  roleGuard("instructor"),
  async (req, res) => {
    try {
      const deleted = await deleteLesson(req.params.lessonId);
      res.status(200).json({ message: "Lesson deleted", data: deleted });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

LessonRouter.post(
  "/:lessonId/content",
  upload.single("file"),
  authGuard,
  roleGuard("instructor"),
  addLessonContent
);

LessonRouter.use("/", QuizRouter);

export default LessonRouter;
