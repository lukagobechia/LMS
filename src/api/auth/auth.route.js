import { Router } from "express";
import {
  renderResetPassword,
  requestResetPassword,
  resendVerificationCodeToEmail,
  resetPassword,
  signIn,
  signUp,
  verifyEmail,
} from "./auth.service.js";

const authRouter = Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);

authRouter.post("/verify-email", verifyEmail);
authRouter.post("/resend-verify-email", resendVerificationCodeToEmail);

authRouter.post("/request-reset-password", requestResetPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.get("/reset-password", renderResetPassword);

export default authRouter;
