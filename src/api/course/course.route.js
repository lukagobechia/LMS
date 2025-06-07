import { Router } from "express";
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "./course.service.js";
import { authGuard } from "../../middlewares/auth.middleware.js";
import { roleGuard } from "../../middlewares/role.middleware.js";

const CourseRouter = Router();

CourseRouter.get("/", getCourses);
CourseRouter.get("/:id", getCourseById);

CourseRouter.post("/", authGuard, roleGuard("instructor"), createCourse);
CourseRouter.put("/:id", authGuard, roleGuard("instructor"), updateCourse);
CourseRouter.delete("/:id", authGuard, roleGuard("instructor"), deleteCourse);

export default CourseRouter;