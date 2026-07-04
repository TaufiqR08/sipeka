import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import JSZip from "jszip";
import fs from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: { idLaya: string } }
) {
  try {
    // Wajib login
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { idLaya } = params;

    // Ambil data layanan beserta semua dokumen yang sudah diupload
    const layanan = await prisma.layanan.findUnique({
      where: { idLaya },
      include: {
        pimpinan: { select: { nama: true, nip: true } },
        kategori: { select: { nmKate: true } },
        listDokumen: {
          include: {
            daftar: { select: { nmDaft: true } },
          },
        },
      },
    });

    if (!layanan) {
      return NextResponse.json({ error: "Layanan tidak ditemukan" }, { status: 404 });
    }

    if (layanan.listDokumen.length === 0) {
      return NextResponse.json({ error: "Belum ada dokumen yang diupload" }, { status: 404 });
    }

    // Buat nama file ZIP
    const pegawaiNama = layanan.pimpinan?.nama?.replace(/\s+/g, "_") || "pegawai";
    const kategoriNm = layanan.kategori?.nmKate?.replace(/\s+/g, "_") || "dokumen";
    const zipName = `${kategoriNm}_${pegawaiNama}_${idLaya.slice(-6)}.zip`;

    // Buat ZIP menggunakan JSZip
    const zip = new JSZip();

    // Tambahkan setiap file ke ZIP
    for (const dok of layanan.listDokumen) {
      const fileRelPath = dok.file; // misal: /uploads/KGB/xxx.pdf

      // Resolve path absolut
      let absolutePath: string;
      if (fileRelPath.startsWith("/uploads/")) {
        absolutePath = path.join(process.cwd(), "public", fileRelPath);
      } else if (fileRelPath.startsWith("/api/uploads/")) {
        const restPath = fileRelPath.replace("/api/uploads/", "");
        absolutePath = path.join(process.cwd(), "public", "uploads", restPath);
      } else {
        absolutePath = path.join(process.cwd(), "public", fileRelPath);
      }

      if (fs.existsSync(absolutePath)) {
        const ext = path.extname(absolutePath);
        const namaFile = `${dok.daftar.nmDaft.replace(/\s+/g, "_")}${ext}`;
        const fileBuffer = fs.readFileSync(absolutePath);
        zip.file(namaFile, fileBuffer);
      }
    }

    // Generate ZIP sebagai Buffer
    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 9 },
    });

    return new NextResponse(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${zipName}"`,
        "Content-Length": zipBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("Download ZIP error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal membuat file ZIP" },
      { status: 500 }
    );
  }
}
