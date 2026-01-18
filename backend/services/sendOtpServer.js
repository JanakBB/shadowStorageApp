import env from "../config/env.js";
import { Resend } from "resend";
import crypto from "crypto";
import OTP from "../models/otpModel.js";

export async function sendOtpEmail(email) {
  try {
    const otp = crypto.randomInt(100000, 1000000).toString();
    await OTP.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    const resend = new Resend(env.RESEND_API_KEY);
    const { data } = await resend.emails.send({
      from: "Register App <onboarding@resend.dev>",
      to: email,
      replyTo: "you@example.com",
      subject: "Register App verification OTP code",
      html: `<strong>Your OTP code is:- ${otp}</strong>`,
      text: `Your OTP code is: ${otp}`,
    });
    return data;
  } catch (error) {
    throw error;
  }
}
