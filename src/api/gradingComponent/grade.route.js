import { Router } from "express";
import { authGuard } from "../../middlewares/auth.middleware.js";
import { roleGuard } from "../../middlewares/role.middleware.js";
import {
  createGradingComponents,
  getGradingComponents,
  assignGrades,
  getStudentGradeByCourse,
  getGradesForAllCourses
} from "./grade.service.js";
import GpaRouter from "./gpa/gpa.route.js";

const GradeRouter = Router();

GradeRouter.post(
  "/courses/:courseId/components",
  authGuard,
  roleGuard("instructor"),
  createGradingComponents
);

GradeRouter.get(
  "/courses/:courseId/components",
  authGuard,
  roleGuard("student", "instructor"),
  getGradingComponents
);

GradeRouter.post(
  "/courses/:courseId/grades",
  authGuard,
  roleGuard("instructor"),
  assignGrades
);

GradeRouter.get(
  "/my/:courseId",
  authGuard,
  roleGuard("student"),
  getStudentGradeByCourse
);

GradeRouter.get(
  "/my",
  authGuard,
  roleGuard("student"),
  getGradesForAllCourses
);

GradeRouter.use("/gpa", GpaRouter);

export default GradeRouter;
