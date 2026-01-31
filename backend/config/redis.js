import env from "./env.js";
import { createClient } from "redis";

const redisClient = createClient({
  username: "default",
  password: env.REDIS_PASSWORD,
  socket: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
  },
});
redisClient.on("error", (err) => {
  console.log("Redis Client Error", err);
});
redisClient.on("connect", () => {
  console.log("✅ Redis connected successfully");
});

export default redisClient;

export const createSessionIndex = async () => {
  try {
    try {
      await redisClient.ft.info("userIdIdx");
      return true;
    } catch (error) {
      if (error.message.includes("Unknown index name")) {
        await redisClient.ft.create(
          "userIdIdx",
          {
            "$.userId": {
              type: "TAG",
              AS: "userId",
            },
            "$.rootDirId": {
              type: "TAG",
              AS: "rootDirId",
            },
          },
          {
            ON: "JSON",
            PREFIX: ["session:"],
          },
        );
        console.log("✅ Session index created");
        return true;
      }
      throw error;
    }
  } catch (error) {
    console.error("Failed to create index:", error);
    return false;
  }
};
