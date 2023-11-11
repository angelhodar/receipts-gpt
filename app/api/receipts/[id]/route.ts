import { NextResponse } from "next/server";
import { getOrigin } from "@/lib/utils";
import { getReceiptStorageKey } from "@/lib/storage";
import { getReceiptData, setReceiptData, enqueueReceipt } from "@/lib/redis";
import { ReceiptStatus, Receipt } from "@/types";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;

  const receipt = await getReceiptData(id);

  if (receipt) return NextResponse.json(receipt);

  const receiptKey = await getReceiptStorageKey(id);

  if (!receiptKey) throw new Error("No receipt found with the provided id")

  const receiptData: Receipt = { status: ReceiptStatus.QUEUED, key: receiptKey }

  await setReceiptData(id, receiptData);

  const endpoint = `${getOrigin(req)}/receipts/${id}/parse`

  await enqueueReceipt({ endpoint, message: { receiptUrl: receiptKey } });

  return NextResponse.json(receiptData);
}
