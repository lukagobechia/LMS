import { Router } from "express";
import {
  enrollInCourse,
  getMyCourses,
  getEnrolledStudents
} from "./enrollment.service.js";
import { authGuard } from "../../middlewares/auth.middleware.js";
import { roleGuard } from "../../middlewares/role.middleware.js";

const EnrollmentRouter = Router();

EnrollmentRouter.post(
  "/:courseId",
  authGuard,
  roleGuard("student"),
  enrollInCourse
);

EnrollmentRouter.get(
  "/my-courses",
  authGuard,
  roleGuard("student"),
  getMyCourses
);

EnrollmentRouter.get(
  "/enrolled-students/:courseId",
  authGuard,
  roleGuard("student","instructor"),
  getEnrolledStudents
);

export default EnrollmentRouter;
