import { Redis } from "@upstash/redis";
import { Client } from "@upstash/qstash";
import { verifySignatureEdge } from "@upstash/qstash/dist/nextjs";
import { Receipt } from "../types";

interface NotificationProps {
  endpoint: string;
  message: object;
}

const qstashClient = new Client({
  token: process.env.QSTASH_TOKEN!,
});

const redisClient = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const enqueueReceipt = async ({ endpoint, message }: NotificationProps) => {
  const messageId = await qstashClient.publishJSON({
    url: endpoint,
    body: message,
    headers: { content: "application/json" },
  });

  console.log(messageId)
};

export const getReceiptData = async (id: string): Promise<Receipt | null> => {
  return await redisClient.get<Receipt>(id);
};

export const setReceiptData = async (
  id: string,
  data: Partial<Receipt>
) => {
  return await redisClient.set(id, data);
};

export { verifySignatureEdge }
