import { NextResponse } from "next/server";
import { findImageKey, getReceiptMetadata } from "@/lib/s3";
import { getReceiptStatus, changeReceiptStatus, notify } from "@/lib/redis";
import { ReceiptStatus } from "@/types";

export const runtime = "edge";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  console.log("Retrieving receipt status for " + id);

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

  if (status == ReceiptStatus.QUEUED || status == ReceiptStatus.SCANNED) {
    return NextResponse.json({ status });
  }

  await changeReceiptStatus(id, ReceiptStatus.QUEUED);

  const key = await findImageKey(id);

  console.log("Found key for receipt " + id);

  if (!key) throw new Error("Trying to get receipt that doesnt exist");

  await notify({ endpoint: `receipts/${id}/ocr`, message: { file: key } });

  return NextResponse.json({ status: ReceiptStatus.QUEUED });
}
