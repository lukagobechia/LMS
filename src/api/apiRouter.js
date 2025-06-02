import { Router } from "express";
import authRouter from "./auth/auth.route.js";
import UserRouter from "./user/user.route.js";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/user", UserRouter);

export default apiRouter;
