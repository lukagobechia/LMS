import { Router } from "express";
import { createQuiz, getQuiz, submitQuiz } from "./quiz.service.js";
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
      const result = await submitQuiz(req.params.quizId, req.body.answers);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default QuizRouter;
