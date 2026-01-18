import { sendOtpEmail } from "../services/sendOtpServer.js";
import OTP from "../models/otpModel.js";
import { emailSchema, otpSchema } from "../validators/authSchema.js";

export const sendOTP = async (req, res, next) => {
  const { success, data, error } = emailSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ error: "Invalid email" });
  }
  const { email } = data;

  try {
    const data = await sendOtpEmail(email);

    res.status(201).json({
      success: true,
      message: `Verification code sent to ${email}`,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (req, res, next) => {
  try {
    const { success, data, error } = otpSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ error: "Invalid OTP" });
    }
    const { email, otp } = data;
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or Expired OTP!" });
    }

    res.status(201).json({
      success: true,
      message: "OTP Verified",
    });
  } catch (error) {
    next(error);
  }
};
