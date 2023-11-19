import { NextResponse } from "next/server";
import sharp from "sharp"
import { getOrigin } from "@/lib/utils";
import { getReceiptStorageKey, upload, remove } from "@/lib/storage";
import { getReceiptURLFromID } from "@/lib/utils";
import { getReceiptData, setReceiptData, enqueueReceipt } from "@/lib/redis";
import { ReceiptStatus, Receipt } from "@/types";

async function resizeReceipt(receiptKey: string) {
  const [name, _] = receiptKey.split(".")
  const imageUrl = getReceiptURLFromID(receiptKey);
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();

  const image = sharp(buffer);

  const optimizedBuffer = await image.resize({ width: 512 }).toFormat("webp").toBuffer();
  const newImageKey = name + ".webp"
  await upload(newImageKey, optimizedBuffer)

  return newImageKey
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;

  const receipt = await getReceiptData(id);
  if (receipt) return NextResponse.json(receipt);

  const receiptKey = await getReceiptStorageKey(id);
  if (!receiptKey) throw new Error("No receipt found with the provided id")

  const resizedReceiptKey = await resizeReceipt(receiptKey)
  console.log("Receipt resized")
  const receiptData: Receipt = { status: ReceiptStatus.QUEUED, key: resizedReceiptKey }

  await setReceiptData(id, receiptData);
  console.log("Setup receipt data in redis")

  await remove(receiptKey)
  console.log("Unoptimized receipt removed")

  console.log("Before enqueue")

  const origin = getOrigin(req)

  enqueueReceipt({ endpoint: `${origin}/api/receipts/${id}/parse`, message: { receiptKey: resizedReceiptKey } });

  return NextResponse.json(receiptData);
}
