import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: { type: String, required: true, enum: ["instructor", "student"] },
    isVerified: { type: Boolean, default: false },
    otpCode: { type: String, select: false },
    validateOtpCodeDate: { type: Date, select: false },
  },
  {
    collection: "users",
    timeseries: true,
    read: "nearest",
    writeConcern: {
      w: "majority",
      j: true,
      wtimeoutMS: 30000,
    },
  }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
