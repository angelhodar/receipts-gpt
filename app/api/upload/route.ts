import { NextResponse } from "next/server";
import { generatePresignedURL } from "@/lib/s3"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const file = searchParams.get("file") as string;
  const type = searchParams.get("fileType") as string;

  const presignedData = await generatePresignedURL(file, type)

  return NextResponse.json(presignedData);
}
