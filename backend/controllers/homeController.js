import redisClient from "../config/redis.js";
import User from "../models/userModel.js";
import ApiError from "../utils/apiError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const homeData = catchAsync(async (req, res, next) => {
  const signedCookie = req.signedCookies;
  const sid = signedCookie.sid;
  if (!sid) {
    res.clearCookie("sid");
    throw new ApiError(400, "User not exist");
  }

  const sessionExist = await redisClient.json.get(`session:${sid}`);

  if (!sessionExist) {
    res.clearCookie("sid");
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
