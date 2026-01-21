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

export const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password is too long"),
});

export const registerSchema = loginSchema.extend({
  fullName: z
    .string()
    .min(3, "Name should be at least 3 characters")
    .max(100, "Name can be at max 100 characters"),
  otp: z
    .string("Please enter a valid 6 digit OTP string")
    .regex(/^\d{6}$/, "Please enter a valid 6 digit OTP"),
});
