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
  console.log("Called ocr for file: " + file);
  const { metadata, rawText } = await analyzeReceiptWithDocumentAPI(file);

  await uploadReceiptMetadata(id + ".metadata.json", metadata);
  console.log("Uploaded metadata for ocr: " + file);
  await changeReceiptStatus(id, ReceiptStatus.SCANNED);

  const { origin } = new URL(request.url);

  fetch(`${origin}/api/receipts/${id}/parse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: rawText }),
  });

  return NextResponse.json({ status: ReceiptStatus.SCANNED });
}
