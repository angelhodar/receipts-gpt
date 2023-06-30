import { NextResponse } from "next/server";
import { uploadReceiptMetadata } from "@/lib/s3";
import { parseReceiptRawText } from "@/lib/openai";
import { changeReceiptStatus } from "@/lib/redis";
import { ReceiptStatus } from "@/types";

export const runtime = "edge";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  const { text } = await request.json();
  const items = await parseReceiptRawText(text);

  await uploadReceiptMetadata(id + ".json", items);
  await changeReceiptStatus(id, ReceiptStatus.PROCESSED);

  return NextResponse.json({ status: ReceiptStatus.PROCESSED });
}