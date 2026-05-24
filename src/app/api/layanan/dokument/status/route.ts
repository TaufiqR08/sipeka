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

    const ddokument = await prisma.listDokumen.findUnique({
      where:{
        id
      },
      include:{
        layanan:true,
        // daftar:{
        //   include:{
        //     kategori:true
        //   }
        // },
      }
    })
    const pegawai =await prisma.pegawai.findUnique({
      where:{
        id : ddokument?.layanan.pimpinanId
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

    const kdDaft = ddokument?.idDaft.split("-");
    switch (status) {
      case "DITOLAK":
        _notif({
          title:`PENOLAKAN pada pengajuan ${kdDaft.join(" ")}`,
          message:keterangan+`. respon ini diberikan oleh admin SIPEKA!!! `,
          pegawaiId:pegawai?.id,
          idLaya:ddokument?.idLaya,
          sumber:kdDaft[0],
          info:"DITOLAK"
        });
      break
      case "DISETUJUI":
        _notif({
          title:`pengajuan ${kdDaft.join(" ")}`,
          message:`pengajuan ini telah DISETUJUI, respon ini diberikan oleh admin SIPEKA!!! `,
          pegawaiId:pegawai?.id,
          idLaya:ddokument?.idLaya,
          sumber:kdDaft[0],
          info:"DITOLAK"
        });
      break
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