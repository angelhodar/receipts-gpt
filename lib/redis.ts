import { kv } from '@vercel/kv';
import { ReceiptStatus } from "../types";

export const getReceiptStatus = async (id: string) => {
  return await kv.get<ReceiptStatus>(id);
};

export const changeReceiptStatus = async (
  id: string,
  newStatus: ReceiptStatus
) => {
  console.log(`Marking status as ${newStatus}`);
  return await kv.set(id, newStatus);
};
