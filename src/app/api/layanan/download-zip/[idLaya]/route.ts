import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as archiver from "archiver";
import fs from "fs";
import path from "path";
import { PassThrough } from "stream";

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

    // Buat stream untuk archiver
    const passThrough = new PassThrough();
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.on("error", (err: any) => {
      console.error("Archive error:", err);
    });

    // Pipe archive ke passthrough stream
    archive.pipe(passThrough);

    // Tambahkan setiap file ke ZIP
    for (const dok of layanan.listDokumen) {
      const fileRelPath = dok.file; // misal: /uploads/KGB/xxx.pdf

      // Jika path dimulai dengan /uploads/, resolve ke public/uploads/
      let absolutePath: string;
      if (fileRelPath.startsWith("/uploads/")) {
        absolutePath = path.join(process.cwd(), "public", fileRelPath);
      } else if (fileRelPath.startsWith("/api/uploads/")) {
        // Path via API route — convert ke path langsung
        const restPath = fileRelPath.replace("/api/uploads/", "");
        absolutePath = path.join(process.cwd(), "public", "uploads", restPath);
      } else {
        absolutePath = path.join(process.cwd(), "public", fileRelPath);
      }

      if (fs.existsSync(absolutePath)) {
        const ext = path.extname(absolutePath);
        const namaFile = `${dok.daftar.nmDaft.replace(/\s+/g, "_")}${ext}`;
        archive.file(absolutePath, { name: namaFile });
      }
    }

    // Finalize archive
    await archive.finalize();

    // Collect buffer dari passthrough
    const chunks: Buffer[] = [];
    await new Promise<void>((resolve, reject) => {
      passThrough.on("data", (chunk) => chunks.push(chunk));
      passThrough.on("end", resolve);
      passThrough.on("error", reject);
    });

    const zipBuffer = Buffer.concat(chunks);

    return new NextResponse(zipBuffer, {
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
