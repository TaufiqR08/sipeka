import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { kirimNotifikasiKePegawaiId } from "@/lib/notifikasi";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = params;
    const body = await req.json();
    const { status, alasanPenolakan, catatanAdmin } = body;

    // 1. Update status cuti
    const cuti = await prisma.cuti.update({
      where: { id },
      data: {
        status,
        alasanPenolakan: status === "DITOLAK" ? alasanPenolakan : null,
        catatanAdmin: catatanAdmin ?? null,
      },
    });

    // 2. Kirim notifikasi ke pegawai pengaju
    try {
      const pesanStatus =
        status === "DISETUJUI"
          ? "Selamat! Pengajuan cuti Anda telah DISETUJUI oleh Admin."
          : `Pengajuan cuti Anda DITOLAK oleh Admin.${alasanPenolakan ? ` Alasan: ${alasanPenolakan}` : ""}`;

      await kirimNotifikasiKePegawaiId({
        pegawaiId: cuti.pegawaiId,
        title: status === "DISETUJUI" ? "Cuti Disetujui ✓" : "Cuti Ditolak ✗",
        message: pesanStatus,
        link: "/dashboard/cuti",
      });
    } catch (_) {}

    return NextResponse.json(cuti);
  } catch (error: any) {
    console.error("Status update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
