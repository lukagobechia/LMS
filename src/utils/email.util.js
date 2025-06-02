import nodemailer from "nodemailer";
import dotenv from "dotenv";
import ejs from "ejs";
import path from "path";
import juice from "juice";

dotenv.config();

const transporter = nodemailer.createTransport({
  port: process.env.EMAIL_PORT,
  host: process.env.EMAIL_HOST,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  secure: true,
});

export const sendActivationEmail = async (user, otpCode) => {
  const templatePath = path.join(
    process.cwd(),
    "views",
    "emails",
    "templates",
    "activation-email.ejs"
  );

  const htmlWithStyle = await ejs.renderFile(templatePath, {
    firstName: user.firstName,
    otpCode: otpCode,
  });

  const inlinedHtml = juice(htmlWithStyle);

  const mailData = {
    from: `"LMS" <info@lms.ge>`,
    to: user.email,
    subject: "Activate Your Account",
    html: inlinedHtml,
  };

  transporter.sendMail(mailData, function (err, info) {
    if (err) {
      console.log(err);
      throw new Error(err);
    } else console.log(info);
  });
};

export const sendWelcomeEmail = async (user) => {
  const templatePath = path.join(
    process.cwd(),
    "views",
    "emails",
    "templates",
    "welcome-email.ejs"
  );

  const htmlWithStyle = await ejs.renderFile(templatePath, {
    firstName: user.firstName,
  });

  const inlinedHtml = juice(htmlWithStyle);

  const mailData = {
    from: `"LMS" <info@lms.ge>`,
    to: user.email,
    subject: "Welcome to LMS",
    html: inlinedHtml,
  };
  transporter.sendMail(mailData, function (err, info) {
    if (err) {
      console.log(err);
      throw new Error(err);
    } else console.log(info);
  });
};

export const sendResetPasswordEmail = async (user, token) => {
  const templatePath = path.join(
    process.cwd(),
    "views",
    "emails",
    "templates",
    "password-reset-email.ejs"
  );

  const htmlWithStyle = await ejs.renderFile(templatePath, {
    firstName: user.firstName,
    token,
  });

  const inlinedHtml = juice(htmlWithStyle);

  const mailData = {
    from: `"LMS" <info@lms.ge>`,
    to: user.email,
    subject: "Reset Password",
    html: inlinedHtml,
  };
  transporter.sendMail(mailData, function (err, info) {
    if (err) {
      console.log(err);
      throw new Error(err);
    } else console.log(info);
  });
};
