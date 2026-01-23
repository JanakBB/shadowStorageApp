import env from "../config/env.js";
import { Resend } from "resend";
import crypto from "crypto";
import OTP from "../models/otpModel.js";
import ApiError from "../utils/apiError.js";

export async function sendOtpEmail(email) {
  try {
    const otp = crypto.randomInt(100000, 1000000).toString();
    await OTP.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true, new: true },
    );

    const resend = new Resend(env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: "Register App <onboarding@resend.dev>",
      to: email,
      replyTo: "you@example.com",
      subject: "Register App verification OTP code",
      html: `<strong>Your OTP code is:- ${otp}</strong>`,
      text: `Your OTP code is: ${otp}`,
    });

    if (error) {
      throw new ApiError(
        503,
        "Failed to send verification email. Please try again.",
      );
    }
    return data;
  } catch (error) {
    throw new ApiError(
      500,
      "Unable to send OTP at this time. Please try again later.",
    );
  }
}
