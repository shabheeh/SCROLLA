import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.error("Redis Client Error:", err));
redisClient.on("connect", () => console.log("Redis Client Connected"));

redisClient
  .connect()
  .catch((err) => console.error("Redis Connection Error:", err));

export { redisClient };
