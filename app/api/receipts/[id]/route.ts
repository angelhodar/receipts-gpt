import { NextResponse } from "next/server";
import { findImageKey, getReceiptMetadata } from "@/lib/s3";
import { getReceiptStatus, changeReceiptStatus } from "@/lib/redis";
import { ReceiptStatus } from "@/types";

export const runtime = "edge";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const status = await getReceiptStatus(id);

  if (status == ReceiptStatus.PROCESSED) {
    const receiptMetadata = await getReceiptMetadata(id + ".json");
    if (!receiptMetadata)
      return NextResponse.json({ message: "Error retrieving metadata" });
    return NextResponse.json({
      status: ReceiptStatus.PROCESSED,
      items: receiptMetadata,
    });
  }

  console.log("Checking status...");

  if (status == ReceiptStatus.QUEUED || status == ReceiptStatus.SCANNED) {
    return NextResponse.json({ status });
  }

  await changeReceiptStatus(id, ReceiptStatus.QUEUED);

  const key = await findImageKey(id);

  console.log("Found key: " + key);

  if (!key) throw new Error("Trying to get receipt that doesnt exist");

  const { origin } = new URL(request.url);

  fetch(`${origin}/api/receipts/${id}/ocr`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file: key }),
  });

  console.log("Fetch " + `${origin}/api/receipts/${id}/ocr`)

  await new Promise(resolve => setTimeout(resolve, 1000))

  return NextResponse.json({ status: ReceiptStatus.QUEUED });
}
