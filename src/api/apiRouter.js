import { Router } from "express";
import authRouter from "./auth/auth.route.js";
import UserRouter from "./user/user.route.js";
import CourseRouter from "./course/course.route.js";
import LessonRouter from "./lesson/lesson.route.js";
import ProgressRouter from "./lessonProgress/lessonProgress.route.js";
import EnrollmentRouter from "./enrollment/enrollment.route.js";
import AttendanceRouter from "./attendance/attendance.route.js";
import FileRouter from "./file/file.route.js";
import GradeRouter from "./gradingComponent/grade.route.js";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/user", UserRouter);
apiRouter.use("/courses", CourseRouter);
apiRouter.use("/lessons", LessonRouter);
apiRouter.use("/progress", ProgressRouter);
apiRouter.use("/enrollment", EnrollmentRouter);
apiRouter.use("/attendance", AttendanceRouter);
apiRouter.use("/file", FileRouter);
apiRouter.use("/grades", GradeRouter);

export default apiRouter;
