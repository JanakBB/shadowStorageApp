import { sendOtpEmail } from "../services/sendOtpServer.js";
import OTP from "../models/otpModel.js";
import { emailSchema, otpSchema } from "../validators/authSchema.js";
import { catchAsync } from "../utils/catchAsync.js";
import ApiError from "../utils/apiError.js";

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
