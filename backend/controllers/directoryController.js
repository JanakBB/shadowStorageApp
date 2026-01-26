import User from "../models/userModel.js";
import ApiError from "../utils/apiError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const homeData = catchAsync(async (req, res, next) => {
  const { userId } = req.signedCookies;
  if (!userId) {
    throw new ApiError(400, "You have to log in first");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(400, "User not found");
  }
  res.status(201).json({
    message: "Get data successfully",
  });
});
