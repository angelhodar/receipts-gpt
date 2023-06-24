import { NextResponse } from "next/server";
import {
  findImageKey,
  getReceiptMetadata,
  uploadReceiptMetadata,
} from "@/lib/s3";
import { analyzeReceiptWithGPT } from "@/lib/textract";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const receiptMetadata = await getReceiptMetadata(id + ".json");

  if (receiptMetadata) return NextResponse.json(receiptMetadata);

  const key = await findImageKey(id);

  if (!key) throw new Error("Trying to get receipt that doesnt exist");

  const { metadata, parsed } = await analyzeReceiptWithGPT(key);

  if (!metadata) throw new Error("Error while detecting receipt data");

  await Promise.all([
    uploadReceiptMetadata(id + ".metadata.json", metadata),
    uploadReceiptMetadata(id + ".json", parsed),
  ]);

  return parsed;
}
