// src/app/api/layanan/dokument/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  // =========================
  // AUTH GUARD
  // =========================
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const idLaya = formData.get("idLaya") as string;
    const idDaft = formData.get("idDaft") as string;

    // =========================
    // VALIDASI INPUT
    // =========================
    if (!file || !idLaya || !idDaft) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // Cegah nilai 'undefined' atau string kosong lolos validasi
    if (
      idLaya === "undefined" ||
      idLaya.trim() === "" ||
      idDaft === "undefined" ||
      idDaft.trim() === ""
    ) {
      return NextResponse.json(
        { error: "ID layanan atau daftar tidak valid" },
        { status: 400 }
      );
    }

    // =========================
    // VALIDASI FILE
    // =========================
    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Format file tidak didukung. Gunakan PDF, JPG, atau PNG." },
        { status: 400 }
      );
    }

    const maxSizeMB = Number(process.env.MAX_FILE_SIZE_MB) || 10;
    if (file.size > maxSizeMB * 1024 * 1024) {
      return NextResponse.json(
        { error: `Ukuran file maksimal ${maxSizeMB}MB` },
        { status: 400 }
      );
    }

    // =========================
    // SAVE FILE
    // =========================
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      idLaya
    );

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Sanitasi nama file: hapus karakter berbahaya selain huruf, angka, dash, underscore, titik
    const safeName = file.name
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_\-\.]/g, "");

    const fileName = `${Date.now()}-${safeName}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    // URL melalui API route (bukan /public langsung) agar bekerja di standalone build
    const fileUrl = `/api/uploads/${idLaya}/${fileName}`;

    // =========================
    // HAPUS FILE LAMA (opsional, cegah tumpukan file)
    // =========================
    const existing = await prisma.listDokumen.findFirst({
      where: { idLaya, idDaft },
    });

    if (existing?.file) {
      try {
        // Konversi /api/uploads/... ke path fisik
        const oldRelative = existing.file.replace(/^\/api\/uploads\//, "");
        // Kompatibel juga dengan path lama /uploads/...
        const oldRelativeLegacy = existing.file.replace(/^\/uploads\//, "");

        const oldPathNew = path.join(process.cwd(), "public", "uploads", oldRelative);
        const oldPathLegacy = path.join(process.cwd(), "public", "uploads", oldRelativeLegacy);

        const oldPath = fs.existsSync(oldPathNew) ? oldPathNew : oldPathLegacy;

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      } catch {
        // Tidak perlu gagal hanya karena file lama tidak bisa dihapus
        console.warn("Gagal menghapus file lama:", existing.file);
      }
    }

    // =========================
    // UPDATE / CREATE DB
    // =========================
    let result;

    if (existing) {
      result = await prisma.listDokumen.update({
        where: { id: existing.id },
        data: { file: fileUrl },
      });
    } else {
      result = await prisma.listDokumen.create({
        data: { idLaya, idDaft, file: fileUrl },
      });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Gagal upload dokumen" },
      { status: 500 }
    );
  }
}
