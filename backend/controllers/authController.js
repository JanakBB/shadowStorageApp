import { sendOtpEmail } from "../services/sendOtpServer.js";
import OTP from "../models/otpModel.js";
import { emailSchema, otpSchema } from "../validators/authSchema.js";
import { catchAsync } from "../utils/catchAsync.js";
import ApiError from "../utils/apiError.js";
import env from "../config/env.js";
import { OAuth2Client } from "google-auth-library";
import mongoose, { Types } from "mongoose";
import User from "../models/userModel.js";
import redisClient, { createSessionIndex } from "../config/redis.js";
import Directory from "../models/directoryModel.js";

export const sendOTP = catchAsync(async (req, res, next) => {
  const { success, data, error } = emailSchema.safeParse(req.body);
  if (!success) {
    const fieldErrors = error.flatten().fieldErrors;
    const messages = Object.entries(fieldErrors)
      .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
      .join("; ");

    throw new ApiError(400, messages);
  }
  const { email } = data;

  await sendOtpEmail(email);

  res.status(201).json({
    success: true,
    message: `Verification code sent to ${email}`,
    data,
  });
});

export const verifyOTP = catchAsync(async (req, res, next) => {
  const { success, data, error } = otpSchema.safeParse(req.body);
  if (!success) {
    const fieldErrors = error.flatten().fieldErrors;
    const messages = Object.entries(fieldErrors)
      .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
      .join("; ");

    throw new ApiError(400, messages);
  }

  const { email, otp } = data;
  const otpRecord = await OTP.findOne({ email, otp });
  if (!otpRecord) {
    throw new ApiError(400, "Invalid or Expired OTP!");
  }

  res.status(201).json({
    message: "OTP Verified",
  });
});

export const loginWithGoogle = catchAsync(async (req, res, next) => {
  const { credential } = req.body;
  if (!credential) {
    throw new ApiError(400, "Credential is required!");
  }

  const client = new OAuth2Client({
    clientId: env.GOOGLE_CLIENT_ID,
  });
  const loginTicket = await client.verifyIdToken({
    idToken: credential,
    audience: env.GOOGLE_CLIENT_ID,
  });
  const { email, name } = loginTicket.getPayload();

  let user = await User.findOne({ email }).select("-__v");

  if (user) {
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
  } else {
    const rootDirId = new Types.ObjectId();
    const userId = new Types.ObjectId();

    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
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
            fullName: name,
            email: email,
            rootDirId: rootDirId,
          },
        ],
        { session },
      );
    });

    await session.endSession();

    const sessionId = crypto.randomUUID();
    const redisKey = `session:${sessionId}`;
    await redisClient.json.set(redisKey, "$", {
      userId: userId,
      rootDirId: rootDirId,
    });

    res.cookie("sid", sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60,
      signed: true,
    });

    res.status(201).json({ message: "Login successfully." });
  }
});
