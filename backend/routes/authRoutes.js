import express from "express";
import {
  loginWithGoogle,
  sendOTP,
  verifyOTP,
} from "../controllers/authController.js";
import { ensureRedisConnected } from "../middleware/redisMiddleware.js";

const router = express.Router();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/google", ensureRedisConnected, loginWithGoogle);

export default router;
