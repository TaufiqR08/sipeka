// src/app/api/uploads/[...filepath]/route.ts
// Serve uploaded files secara aman via API route
// Diperlukan karena mode `output: 'standalone'` tidak meng-include folder public/

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";

// Ekstensi dan MIME type yang diizinkan
const ALLOWED_MIME: Record<string, string> = {
  pdf:  "application/pdf",
  png:  "image/png",
  jpg:  "image/jpeg",
  jpeg: "image/jpeg",
};

export async function GET(
  req: NextRequest,
  { params }: { params: { filepath: string[] } }
) {
  try {
    // Wajib login untuk melihat file
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Susun path dari segment
    const segments = params.filepath;

    // Sanitasi: tolak path traversal (..)
    if (segments.some((s) => s.includes(".."))) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    const filePath = path.join(
      process.cwd(),
      "public",
      "uploads",
      ...segments
    );

    // Pastikan file ada
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 404 });
    }

    // Validasi ekstensi
    const ext = path.extname(filePath).replace(".", "").toLowerCase();
    const contentType = ALLOWED_MIME[ext];
    if (!contentType) {
      return NextResponse.json({ error: "Tipe file tidak didukung" }, { status: 400 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${path.basename(filePath)}"`,
        // Cache 1 jam, revalidate setiap kunjungan
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    console.error("File serve error:", error);
    return NextResponse.json(
      { error: "Gagal membaca file" },
      { status: 500 }
    );
  }
}
