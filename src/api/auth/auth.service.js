import UserModel from "../user/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  sendActivationEmail,
  sendResetPasswordEmail,
  sendWelcomeEmail,
} from "../../utils/email.util.js";

const generateOtp = () => {
  const otpCode = Math.random().toString().slice(2, 8);
  const validateOtpCodeDate = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes from now
  return { otpCode, validateOtpCodeDate };
};

const validatePassword = (password) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
  return regex.test(password);
};

export const signUp = async (req, res) => {
  try {
    const { email, password, ...rest } = req.body;
    const existUser = await UserModel.findOne({ email });
    if (existUser)
      return res
        .status(400)
        .json({ message: "User with that email already exists" });

    if (!validatePassword(password)) {
      throw new Error(
        "Password does not meet criteria: Password must contain Minimum 8 and maximum 20 characters, at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const { otpCode, validateOtpCodeDate } = generateOtp();

    const newUser = {
      email,
      password: hashedPassword,
      otpCode,
      validateOtpCodeDate,
      ...rest,
    };

    sendActivationEmail(newUser, otpCode);

    await UserModel.create(newUser);

    return res
      .status(201)
      .json({ message: "Verification email has sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
    throw new Error(error.message);
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, otpCode } = req.body;
    const user = await UserModel.findOne({ email }).select('+otpCode +validateOtpCodeDate');

    if (!user)
      return res
        .status(400)
        .json({ message: "User with that email does not exist" });
    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });
    if (otpCode !== user.otpCode || otpCode.length !== 6)
      return res.status(400).json({ message: "Invalid OTP code" });
    if (!user.validateOtpCodeDate || user.validateOtpCodeDate < new Date())
      return res.status(400).json({ message: "OTP code expired" });

    await UserModel.findByIdAndUpdate(user._id, {
      isVerified: true,
      otpCode: null,
      validateOtpCodeDate: null,
    });

    const token = jwt.sign(
      {
        userId: user._id,
        userEmail: user.email,
        isVerified: user.isVerified,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    sendWelcomeEmail(user);

    return res.status(200).json({ message: "Verified successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
    throw new Error(error.message);
  }
};

export const resendVerificationCodeToEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    const { otpCode, validateOtpCodeDate } = generateOtp();
    await UserModel.findByIdAndUpdate(user._id, {
      otpCode,
      validateOtpCodeDate,
    });
    await sendActivationEmail(user, otpCode);

    res.status(200).json({ message: "OTP code resent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
    throw new Error(error.message);
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });
    if (!user.isVerified) {
      await sendActivationEmail(user, otpCode);

      return res
        .status(401)
        .json({ message: "Account not verified. Please check your email." });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        userEmail: user.email,
        isVerified: user.isVerified,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
    throw new Error(error.message);
  }
};

export const requestResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const token = jwt.sign(
      { userId: user._id, userEmail: user.email, isVerified: user.isVerified },
      process.env.JWT_SECRET,
      { expiresIn: "3m" }
    );

    sendResetPasswordEmail(user, token);
    res.status(200).json({ message: "Reset link sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
    throw new Error(error.message);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { password, repeatPassword, token } = req.body;
    if (!password || !repeatPassword)
      return res.status(400).json({ message: "Password fields required" });

    if (password !== repeatPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(payload.userId).select("+password");
    if (!user) return res.status(400).json({ message: "User not found" });

    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword)
      return res
        .status(400)
        .json({ message: "New password cannot be same as old" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.findByIdAndUpdate(payload.userId, {
      password: hashedPassword,
    });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid or expired token" });
    throw new Error(error.message);
  }
};

export const renderResetPassword = async (req, res) => {
  const { token } = req.query;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return res.render("reset-password", { token });
  } catch (error) {
    let message;
    if (error instanceof jwt.TokenExpiredError) {
      message = "Link has expired";
      return res.render("token-expired", { message });
    }

    message = "Invalid token";
    return res.render("token-expired", { message });
  }
};

