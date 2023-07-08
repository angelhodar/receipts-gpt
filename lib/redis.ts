import { Redis } from "@upstash/redis";
import { Client, Receiver } from "@upstash/qstash/cloudflare";
import { ReceiptStatus } from "../types";

interface NotificationProps {
  endpoint: string;
  message: any;
}

const qstashClient = new Client({
  token: process.env.QSTASH_TOKEN!,
});

const redisClient = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const validate = (handler: any) => {
  const qstashReceiver = new Receiver({
    currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
    nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
  });

  return async (request: Request, ...params: any) => {
    const clonedRequest = request.clone();

    const isValid = await qstashReceiver.verify({
      signature: clonedRequest.headers.get("upstash-signature")!,
      body: await clonedRequest.text(),
    });

    if (!isValid) {
      return new Response("Unauthorized", {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    return await handler(request, ...params);
  };
};

export const notify = async ({ endpoint, message }: NotificationProps) => {
  const baseUrl = `https://${
    process.env.VERCEL_URL || process.env.API_URL
  }/api/`;

  const absoluteUrl = new URL(endpoint, baseUrl);

  console.log("Sending message to " + absoluteUrl.href);

  await qstashClient.publish({
    url: absoluteUrl.href,
    body: JSON.stringify(message),
    headers: { content: "application/json" },
  });
};

export const getReceiptStatus = async (id: string) => {
  return await redisClient.get<ReceiptStatus>(id);
};

export const changeReceiptStatus = async (
  id: string,
  newStatus: ReceiptStatus
) => {
  console.log(`Marking status as ${newStatus}`);
  return await redisClient.set(id, newStatus);
};
