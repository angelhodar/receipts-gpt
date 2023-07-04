import { NextResponse } from "next/server";
import { uploadReceiptMetadata } from "@/lib/s3";
import { analyzeReceiptWithDocumentAPI } from "@/lib/ocr";
import { changeReceiptStatus, validate, notify } from "@/lib/redis";
import { ReceiptStatus } from "@/types";

export const POST = validate(
  async (request: Request, { params }: { params: { id: string } }) => {
    const id = params.id;

    const { file } = await request.json();
    const { metadata, rawText } = await analyzeReceiptWithDocumentAPI(file);

    await uploadReceiptMetadata(id + ".metadata.json", metadata);
    await changeReceiptStatus(id, ReceiptStatus.SCANNED);

    await notify({
      endpoint: `receipts/${id}/parse`,
      message: { text: rawText },
    });

    return NextResponse.json({ status: ReceiptStatus.SCANNED });
  }
);
