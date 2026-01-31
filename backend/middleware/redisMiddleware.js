import redisClient from "../config/redis.js";

export const ensureRedisConnected = async (req, res, next) => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "Redis connection failed" });
  }
};
