// src/app/api/layanan/dokument/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const idLaya = formData.get("idLaya") as string;
    const idDaft = formData.get("idDaft") as string;

    if (!file || !idLaya || !idDaft) {
      return NextResponse.json(
        {
          error: "Data tidak lengkap",
        },
        {
          status: 400,
        }
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
        {
          error: "Format file tidak didukung",
        },
        {
          status: 400,
        }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        {
          error: "Ukuran file maksimal 5MB",
        },
        {
          status: 400,
        }
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
      fs.mkdirSync(uploadDir, {
        recursive: true,
      });
    }

    const fileName = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;

    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const fileUrl = `/uploads/${idLaya}/${fileName}`;

    // =========================
    // CHECK EXISTING
    // =========================

    const existing = await prisma.listDokumen.findFirst({
      where: {
        idLaya,
        idDaft,
      },
    });

    // =========================
    // UPDATE / CREATE
    // =========================

    let result;

    if (existing) {
      result = await prisma.listDokumen.update({
        where: {
          id: existing.id,
        },
        data: {
          file: fileUrl,
        },
      });
    } else {
      result = await prisma.listDokumen.create({
        data: {
          idLaya,
          idDaft,
          file: fileUrl,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Gagal upload dokumen",
      },
      {
        status: 500,
      }
    );
  }
}

