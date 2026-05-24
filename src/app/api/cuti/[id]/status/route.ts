import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = params;
    const body = await req.json();
    const { status, alasanPenolakan } = body;

    // 1. Update status cuti
    const cuti = await prisma.cuti.update({
      where: { id },
      data: {
        status,
        alasanPenolakan: status === "DITOLAK" ? alasanPenolakan : null,
      },
    });

    // 2. Cari User yang terhubung dengan Pegawai ini untuk dikirimkan notifikasi
    const userTarget = await prisma.user.findFirst({ 
      where: { pegawaiId: cuti.pegawaiId } 
    });

    // 3. Buat notifikasi jika user ditemukan
    if (userTarget) {
      // await prisma.notification.create({
      //   data: { 
      //     title: "Update Status Cuti",
      //     message: `Status pengajuan cuti Anda telah diperbarui menjadi ${status.replace(/_/g, " ")}.`,
      //   }
      // });
    }

    return NextResponse.json(cuti);
  } catch (error: any) {
    console.error("Status update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
