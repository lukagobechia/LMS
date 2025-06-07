import { Router } from "express";
import authRouter from "./auth/auth.route.js";
import UserRouter from "./user/user.route.js";
import CourseRouter from "./course/course.route.js";
import LessonRouter from "./lesson/lesson.route.js";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/user", UserRouter);
apiRouter.use("/courses", CourseRouter);
apiRouter.use("/lessons", LessonRouter);

export default apiRouter;