import { NextResponse } from "next/server";
import { uploadReceiptMetadata } from "@/lib/s3";
import { analyzeReceiptWithDocumentAPI } from "@/lib/ocr";
import { changeReceiptStatus } from "@/lib/redis";
import { ReceiptStatus } from "@/types";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  const { file } = await request.json();
  const { metadata, rawText } = await analyzeReceiptWithDocumentAPI(file);

  await uploadReceiptMetadata(id + ".metadata.json", metadata);
  await changeReceiptStatus(id, ReceiptStatus.SCANNED);

  const { origin } = new URL(request.url);

  fetch(`${origin}/api/receipts/${id}/parse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: rawText }),
  });

  return NextResponse.json({ status: ReceiptStatus.SCANNED });
}
