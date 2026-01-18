import { z } from "zod/v4";

export const emailSchema = z.object({
  email: z.email("Please enter valid email"),
});

export const otpSchema = z.object({
  email: z.email("Please enter valid email"),
  otp: z
    .string("Please enter a valid 6 digit OTP string")
    .regex(/^\d{6}$/, "Please enter a valid 6 digit OTP"),
});
