// src/app/api/admin/dokument/status/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      id,
      status,
      keterangan,
    } = body;

    if (!id) {
      return NextResponse.json(
        {
          error: "ID dokumen wajib",
        },
        {
          status: 400,
        }
      );
    }

    const result = await prisma.listDokumen.update({
      where: {
        id,
      },
      data: {
        status,
        keterangan,
      },
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Gagal update status dokumen",
      },
      {
        status: 500,
      }
    );
  }
}