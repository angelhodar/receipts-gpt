import { NextResponse } from "next/server";
import { z } from "zod"
import { generatePresignedURL } from "@/lib/storage"

const queryParamsSchema = z.object({
  file: z.string().min(1, "Parameter is required")
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const parseResult = queryParamsSchema.safeParse({
    file: searchParams.get("file")
  });

  if (!parseResult.success) {
    return new NextResponse(JSON.stringify({ error: "Invalid query parameters" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      },
    });
  }

  const url = await generatePresignedURL(parseResult.data.file);

  return NextResponse.json({ url });
}
