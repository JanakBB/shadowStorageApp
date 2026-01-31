import express from "express";
import { login, register } from "../controllers/userController.js";
import { ensureRedisConnected } from "../middleware/redisMiddleware.js";

const router = express.Router();

router.post("/user/register", register);
router.post("/user/login", ensureRedisConnected, login);

export default router;
