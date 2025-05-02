import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient
  .connect()
  .catch((err) => console.error("Redis Connection Error:", err));

redisClient.on("error", (err) => console.log("Redis Client Error:", err));
redisClient.on("connect", () => console.log("Redis Client Connected"));

export { redisClient };
