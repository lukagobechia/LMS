import {Router} from "express";
import { markLessonComplete, getMyProgressGroupedByCourse, unmarkLessonComplete } from "./lessonProgress.service.js";
import { authGuard } from "../../middlewares/auth.middleware.js";
import { roleGuard } from "../../middlewares/role.middleware.js";

const ProgressRouter = Router();

ProgressRouter.post("/lessons/:lessonId/complete", authGuard, roleGuard("student"), markLessonComplete);
ProgressRouter.get("/:courseId", authGuard, roleGuard("student"), getMyProgressGroupedByCourse);
ProgressRouter.delete("/lessons/:lessonId/complete", authGuard, roleGuard("student"), unmarkLessonComplete);

export default ProgressRouter;
