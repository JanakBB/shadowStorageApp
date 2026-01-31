import express from "express";
import { homeData } from "../controllers/homeController.js";
import { ensureRedisConnected } from "../middleware/redisMiddleware.js";

const router = express.Router();

router.get("/home-data", ensureRedisConnected, homeData);

export default router;
