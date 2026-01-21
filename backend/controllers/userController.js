import env from "../config/env.js";
import { registerSchema } from "../validators/authSchema.js";
import OTP from "../models/otpModel.js";
import mongoose, { Types } from "mongoose";
import Directory from "../models/directoryModel.js";
import User from "../models/userModel.js";

export const register = async (req, res, next) => {
  const validationResult = registerSchema.safeParse(req.body);

  if (!validationResult.success) {
    console.log("Validation errors:", validationResult.error.format());

    return res.status(400).json({
      error: validationResult.error.flatten().fieldErrors,
    });
  }

  const { fullName, email, password, otp } = validationResult.data;

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const otpRecord = await OTP.findOne({ email, otp }).session(session);

      if (!otpRecord) {
        throw new Error("Invalid or expired OTP");
      }

      const rootDirId = new Types.ObjectId();
      const userId = new Types.ObjectId();

      await OTP.deleteOne({ _id: otpRecord._id }).session(session);

      await Directory.create(
        [
          {
            _id: rootDirId,
            name: `root-${email}`,
            parentDirId: null,
            userId: userId,
          },
        ],
        { session },
      );

      await User.create(
        [
          {
            _id: userId,
            fullName,
            email,
            password, // Use hashed password
            rootDirId,
          },
        ],
        { session },
      );
    });

    await session.endSession();

    res.status(201).json({ message: "Registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    await session.endSession();

    if (error.message === "Invalid or expired OTP") {
      return res.status(400).json({ error: error.message });
    }

    if (error.errorLabels?.includes("TransientTransactionError")) {
      return res.status(503).json({
        error: "Please try again",
      });
    }

    if (error.code === 121) {
      return res.status(400).json({ error: "Invalid input" });
    } else if (error.code === 11000 && error.keyValue?.email) {
      return res.status(409).json({ error: "Email already exists" });
    } else {
      next(error);
    }
  }
};
