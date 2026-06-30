// src/app/api/admin/dokument/status/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { _notif } from "@/lib/sfBGS"

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
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

    const { pegawaiId: requesterId } = session.user as any;

    const ddokument = await prisma.listDokumen.findUnique({
      where:{
        id
      },
      include:{
        layanan:true,
      }
    })

    if (!ddokument) {
      return NextResponse.json({ error: "Dokumen tidak ditemukan" }, { status: 404 });
    }

    // Cegah pemilik pengajuan mengubah status dokumennya sendiri
    if (ddokument.layanan.pimpinanId === requesterId) {
      return NextResponse.json(
        { error: "Anda tidak dapat mengubah status dokumen pengajuan milik Anda sendiri" },
        { status: 403 }
      );
    }

    const pegawai = await prisma.pegawai.findUnique({
      where:{
        // pimpinanId bisa null di schema, konversi ke undefined agar sesuai tipe Prisma
        id: ddokument.layanan.pimpinanId ?? undefined
      }
    });


    const result = await prisma.listDokumen.update({
      where: {
        id,
      },
      data: {
        status,
        keterangan,
      },
    });

    const kdDaft = ddokument.idDaft.split("-");
    // Cast sumber ke union type yang dibutuhkan _notif
    const sumber = kdDaft[0] as "KP" | "KGB" | "CUTI";

    // Kirim notifikasi hanya jika pegawai ditemukan
    if (pegawai?.id) {
      switch (status) {
        case "DITOLAK":
          _notif({
            title:`PENOLAKAN pada pengajuan ${kdDaft.join(" ")}`,
            message:keterangan+`. respon ini diberikan oleh admin SIPEKA!!! `,
            pegawaiId: pegawai.id,
            idLaya: ddokument.idLaya,
            sumber,
            info:"DITOLAK"
          });
          break;
        case "DISETUJUI":
          _notif({
            title:`pengajuan ${kdDaft.join(" ")}`,
            message:`pengajuan ini telah DISETUJUI, respon ini diberikan oleh admin SIPEKA!!! `,
            pegawaiId: pegawai.id,
            idLaya: ddokument.idLaya,
            sumber,
            info:"DISETUJUI",
          });
          break;
      }
    }

    

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    // console.error(error);

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