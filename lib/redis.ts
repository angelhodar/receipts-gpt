import { Redis } from "@upstash/redis";
import { ReceiptStatus } from "@/types";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

export const getReceiptStatus = async (id: string) => {
  return await redis.get<ReceiptStatus>(id);
};

export const changeReceiptStatus = async (
  id: string,
  newStatus: ReceiptStatus
) => {
  return await redis.set(id, newStatus);
};
