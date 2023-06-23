import { NextResponse } from "next/server";
import { findImageKey, getReceiptMetadata, uploadReceiptMetadata } from "@/lib/s3";
import { analyzeReceipt } from "@/lib/textract";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const id = searchParams.get("id") as string;

  const receiptMetadata = await getReceiptMetadata(id);

  if (receiptMetadata) return NextResponse.json(receiptMetadata);

  const key = await findImageKey(id);

  if (!key) throw new Error("Trying to get receipt that doesnt exist")

  const metadata = await analyzeReceipt(key)

  if (!metadata) throw new Error("Error while detecting receipt data")

  await uploadReceiptMetadata(id, metadata)
  
  return metadata
}
