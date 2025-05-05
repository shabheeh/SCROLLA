import { redisClient } from "../configs/redis";

export const storeData = async (
  key: string,
  value: string,
  ttl: number
): Promise<void> => {
  try {
    await redisClient.setEx(key, ttl, value);
  } catch (error) {
    console.error(`Error storing value in Redis for key "${key}":`, error);
    throw new Error("Failed to store data in cache");
  }
};

export const retrieveData = async (key: string): Promise<string | null> => {
  try {
    return await redisClient.get(key);
  } catch (error) {
    console.error(`Error retrieving value from Redis for key "${key}":`, error);
    throw new Error("Failed to retrieve data from cache");
  }
};

export const deleteData = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error(`Error deleting key "${key}" from Redis:`, error);
    throw new Error("Failed to delete data from cache");
  }
};
