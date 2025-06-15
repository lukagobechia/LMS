import { Router } from "express";
import {
  submitAttendance,
  getMyAttendance,
  getCourseAttendance
} from "./attendance.service.js";
import { authGuard } from "../../middlewares/auth.middleware.js";
import { roleGuard } from "../../middlewares/role.middleware.js";
import { getLessonAttendance } from "./attendance.service.js";
const AttendanceRouter = Router();


AttendanceRouter.post("/:lessonId", authGuard, roleGuard("instructor"), submitAttendance);

AttendanceRouter.get("/my", authGuard, roleGuard("student"), getMyAttendance);

AttendanceRouter.get("/:courseId", authGuard, roleGuard("instructor"), getCourseAttendance);

AttendanceRouter.get("/lesson/:lessonId", authGuard, roleGuard("instructor"), getLessonAttendance);

export default AttendanceRouter;