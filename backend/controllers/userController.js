import env from "../config/env.js";
import { loginSchema, registerSchema } from "../validators/authSchema.js";
import OTP from "../models/otpModel.js";
import mongoose, { Types } from "mongoose";
import Directory from "../models/directoryModel.js";
import User from "../models/userModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import ApiError from "../utils/apiError.js";
import redisClient, { createSessionIndex } from "../config/redis.js";

export const register = catchAsync(async (req, res, next) => {
  const { success, data, error } = registerSchema.safeParse(req.body);

  if (!success) {
    const fieldErrors = error.flatten().fieldErrors;
    const messages = Object.entries(fieldErrors)
      .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
      .join("; ");

    throw new ApiError(400, messages);
  }

  const { fullName, email, password, otp } = data;

  const session = await mongoose.startSession();

  await session.withTransaction(async () => {
    const otpRecord = await OTP.findOne({ email, otp }).session(session);

    if (!otpRecord) {
      throw new ApiError(400, "Invalid or expired OTP");
    }

    const rootDirId = new Types.ObjectId();
    const userId = new Types.ObjectId();

    await OTP.deleteOne({ _id: otpRecord._id }).session(session);

    await Directory.create(
      // create for create and save to DB
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
          password,
          rootDirId,
        },
      ],
      { session },
    );
  });

  await session.endSession();

  res.status(201).json({ message: "Registered successfully" });
});

export const login = catchAsync(async (req, res, next) => {
  const { success, data, error } = loginSchema.safeParse(req.body);
  if (!success) {
    const fieldErrors = error.flatten().fieldErrors;
    const messages = Object.entries(fieldErrors)
      .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
      .join("; ");

    throw new ApiError(400, messages);
  }

  const { email, password } = data;
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "Invalid email");
  }
  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    throw new ApiError(400, "Invalid password");
  }

  const isIndexReady = await createSessionIndex();

  if (isIndexReady) {
    const allSessions = await redisClient.ft.search(
      "userIdIdx",
      `@userId:{${user._id}}`,
      { RETURN: [] },
    );

    if (allSessions.total >= 2) {
      await redisClient.del(allSessions.documents[0].id);
    }
  }

  const sessionId = crypto.randomUUID();
  const redisKey = `session:${sessionId}`;
  await redisClient.json.set(redisKey, "$", {
    userId: user._id.toString(),
    rootDirId: user.rootDirId.toString(),
  });

  res.cookie("sid", sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60,
    signed: true,
  });
  res.status(201).json({ message: "Login successfully." });
});
