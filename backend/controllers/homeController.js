import Session from "../models/sessionModel.js";
import User from "../models/userModel.js";
import ApiError from "../utils/apiError.js";
import { catchAsync } from "../utils/catchAsync.js";
import jwt from "jsonwebtoken";

export const homeData = catchAsync(async (req, res, next) => {
  const signedCookie = req.signedCookies;
  const token = signedCookie.token;
  const decodeCredential = jwt.verify(token, process.env.JWT_SECRET);
  const sessionId = decodeCredential.sessionId;
  const sessionExist = await Session.findById(sessionId);

  if (!sessionExist) {
    res.clearCookie("token");
    throw new ApiError(400, "You have to log in first");
  }

  const user = await User.findById(sessionExist.userId);
  if (!user) {
    throw new ApiError(400, "User not found");
  }
  res.status(201).json({
    message: "Get data successfully",
  });
});
