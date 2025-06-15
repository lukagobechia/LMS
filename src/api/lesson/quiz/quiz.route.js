import { Router } from "express";
import {
  createQuiz,
  getQuiz,
  submitQuiz,
  gradeOpenAnswers,
  getQuizResults,
  getQuizResultsStudent,
  updateQuiz,
} from "./quiz.service.js";
import { authGuard } from "../../../middlewares/auth.middleware.js";
import { roleGuard } from "../../../middlewares/role.middleware.js";

const QuizRouter = Router();

QuizRouter.post(
  "/quiz/:lessonId",
  authGuard,
  roleGuard("instructor"),
  async (req, res) => {
    try {
      const result = await createQuiz(req.params.lessonId, req.body.questions);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

QuizRouter.get(
  "/quiz/:quizId",
  authGuard,
  roleGuard("student", "instructor"),
  async (req, res) => {
    try {
      const quiz = await getQuiz(req.params.quizId);
      res.json(quiz);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

QuizRouter.post(
  "/quiz/:quizId/submit",
  authGuard,
  roleGuard("student"),
  async (req, res) => {
    try {
      const result = await submitQuiz(
        req.params.quizId,
        req.user.userId,
        req.body.answers
      );
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

QuizRouter.put(
  "/quiz-submissions/:submissionId/grade",
  authGuard,
  roleGuard("instructor"),
  async (req, res) => {
    try {
      const { submissionId } = req.params;
      const { grades } = req.body;

      const result = await gradeOpenAnswers(submissionId, grades);

      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

QuizRouter.get(
  "/quiz-results/:quizId",
  authGuard,
  roleGuard("instructor"),
  async (req, res) => {
    try {
      const { quizId } = req.params;
      const submissions = await getQuizResults(quizId);
      res.json(submissions);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

QuizRouter.get(
  "/quiz-results/:quizId/student",
  authGuard,
  roleGuard("student"),
  async (req, res) => {
    try {
      const { quizId } = req.params;
      const userId = req.user.userId;
      const submissions = await getQuizResultsStudent(quizId, userId);
      res.json(submissions);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

QuizRouter.put(
  "/quiz/:quizId",
  authGuard,
  roleGuard("instructor"),
  async (req, res) => {
    try {
      const { quizId } = req.params;
      const updatedQuiz = await updateQuiz(quizId, req.body.questions);
      res.json(updatedQuiz);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);
export default QuizRouter;
