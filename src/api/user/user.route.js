import { Router } from "express";
import {
  getCurrentUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
} from "./user.service.js";
import { authGuard } from "../../middlewares/auth.middleware.js";
import { roleGuard } from "../../middlewares/role.middleware.js";
const UserRouter = Router();

UserRouter.get(
  "/me",
  authGuard,
  roleGuard("student", "instructor"),
  getCurrentUser
);
UserRouter.patch(
  "/me",
  authGuard,
  roleGuard("student", "instructor"),
  updateMe
);
UserRouter.delete(
  "/me",
  authGuard,
  roleGuard("student", "instructor"),
  deleteMe
);
UserRouter.patch("/:id", authGuard, roleGuard("instructor"), updateUser);
UserRouter.delete("/:id", authGuard, roleGuard("instructor"), deleteUser);
export default UserRouter;
