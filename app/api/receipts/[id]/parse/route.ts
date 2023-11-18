import { NextRequest, NextResponse } from "next/server";
import { z } from "zod"
// import { getStorageObjectUrl } from "@/lib/storage"
import { parseReceipt } from "@/lib/openai";
import { getReceiptData, setReceiptData } from "@/lib/redis";
import { ReceiptStatus } from "@/types";

export function getStorageObjectUrl(objectKey: string) {
  return `https://receiptsgpt.s3.eu-west-3.amazonaws.com/${objectKey}`;
}

export const runtime = "edge";

const bodySchema = z.object({
  receiptKey: z.string().min(1, "Parameter is required")
});

async function handler(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  const receipt = await getReceiptData(id);

  const body = await request.json();

  const parseResult = bodySchema.safeParse(body);

  if (!parseResult.success) {
    return new NextResponse(JSON.stringify({ error: "Invalid body parameters" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      },
    });
  }

  const receiptUrl = getStorageObjectUrl(parseResult.data.receiptKey)

  const parsedReceipt = await parseReceipt(receiptUrl);

  if (!parsedReceipt) throw new Error("Could not parse receipt")

  const receiptData = { ...receipt, status: ReceiptStatus.PROCESSED, data: parsedReceipt }

  await setReceiptData(id, receiptData);

  return NextResponse.json(receiptData);
}

export const POST = handler
