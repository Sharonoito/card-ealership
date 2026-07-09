import fs from "node:fs/promises";
import path from "node:path";
import { getCarUploadsDir } from "@/app/lib/carUploadPaths";

export const runtime = "nodejs";

const contentTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
    return new Response("Not found", { status: 404 });
  }

  const ext = path.extname(filename).toLowerCase();
  const contentType = contentTypes[ext];
  if (!contentType) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const filePath = path.join(getCarUploadsDir(), filename);
    const bytes = await fs.readFile(filePath);

    return new Response(bytes, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
