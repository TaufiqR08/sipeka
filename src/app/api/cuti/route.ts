import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { kirimNotifikasiKeNip, kirimNotifikasiKePegawaiId } from "@/lib/notifikasi";


// GET — ambil semua cuti (sesuai level akses)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role, bidangId, pegawaiId } = session.user as any;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 10;

  let whereClause: any = {};

  if (status) whereClause.status = status;

  // ============================================
  // Filter visibilitas berdasarkan role
  // ============================================

  if (role === "PEGAWAI") {
    // Hanya melihat pengajuan milik sendiri
    whereClause.pegawaiId = pegawaiId;

  } else if (role === "KEPALA_BIDANG") {
    // Melihat pengajuan seluruh pegawai di bidangnya saja
    whereClause.pegawai = { bidangId };

  } else if (role === "KABAG_UMUM_KEPEGAWAIAN") {
    // Kasubbag berada di Sekretariat → melihat pengajuan pegawai di Sekretariat saja
    whereClause.pegawai = { bidangId };

  } else if (role === "SEKRETARIS_BADAN") {
    // Sekban melihat semua pengajuan kecuali milik Kepala Badan
    // (karena Sekban adalah atasan langsung seluruh pegawai non-Kaban)
    whereClause.NOT = {
      pegawai: {
        user: { role: "KEPALA_BADAN" },
      },
    };

  }
  // KEPALA_BADAN & ADMIN → tidak ada filter, bisa melihat semua pengajuan

  const [data, total] = await Promise.all([
    prisma.cuti.findMany({
      where: whereClause,
      include: { pegawai: { select: { nama: true, jabatan: true, bidang: true, nip: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.cuti.count({ where: whereClause }),
  ]);

  return NextResponse.json({ data, total, page, totalPages: Math.ceil(total / limit) });
}

// POST — buat pengajuan cuti baru (Multipart Form Data)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {pegawaiId} =  (session.user as any);
  
  try {
    const formData = await req.formData();

    // ======================
    // EXTRACT DATA
    // ======================
    const jenisCuti = formData.get("jenisCuti") as string;
    const alasan = formData.get("alasan") as string;
    const tanggalMulai = formData.get("tanggalMulai") as string;
    const tanggalSelesai = formData.get("tanggalSelesai") as string;
    const jumlahHari = parseInt(formData.get("jumlahHari") as string || "0");
    const durasiJenis = formData.get("durasiJenis") as string;
    const alamatSelama = formData.get("alamatSelama") as string;

    const userJabatan = formData.get("userJabatan") as string;
    const userNama = formData.get("userNama") as string;
    const userNip = formData.get("userNip") as string;

    const atasan1Jabatan = formData.get("atasan1Jabatan") as string;
    const atasan1Nama = formData.get("atasan1Nama") as string;
    const atasan1Nip = formData.get("atasan1Nip") as string;

    const atasan2Jabatan = formData.get("atasan2Jabatan") as string;
    const atasan2Nama = formData.get("atasan2Nama") as string;
    const atasan2Nip = formData.get("atasan2Nip") as string;

    const pegawai = await prisma.pegawai.findUnique({
      where: {
        id:pegawaiId,
      },
    }); 
    // console.log(pegawai,session.user);
    
    if (!pegawai) {
      return NextResponse.json(
        { error: "Pegawai tidak ditemukan" },
        { status: 404 }
      );
    }
    
    // ======================
    // FILE UPLOAD
    // ======================
    const file = formData.get("file") as File | null;
    let fileUrl: string | null = null;

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // validate type
      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
      ];

      if (!validTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Format file harus PDF, JPG, atau PNG" },
          { status: 400 }
        );
      }

      // ======================
      // AUTO CREATE FOLDER
      // ======================
      const uploadDir = join(
        process.cwd(),
        "public/uploads/cuti"
      );

      await mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const filePath = join(uploadDir, fileName);

      await writeFile(filePath, buffer);

      fileUrl = `/uploads/cuti/${fileName}`;
    }

    // ======================
    // GET PEGAWAI
    // ======================
    
  

    const dcuti = await prisma.cuti.findFirst({
      where: {
        pegawaiId: pegawaiId,
        status: {
          not: "DISETUJUI",
        },
      },
    });

    const payload = {
      pegawaiId: pegawai.id,
      jenisCuti: jenisCuti as any,
      alasan,
      tanggalMulai: new Date(tanggalMulai),
      tanggalSelesai: new Date(tanggalSelesai),
      jumlahHari,
      durasiJenis: durasiJenis as any,
      alamatSelama,
      filePendukungUrl: fileUrl ?? dcuti?.filePendukungUrl,
      tt: JSON.stringify({
        userNama,
        userJabatan,
        userNip,
        atasan1Jabatan,
        atasan1Nama,
        atasan1Nip,
        atasan2Jabatan,
        atasan2Nama,
        atasan2Nip,
      }),
      status: "MENUNGGU_ATASAN_1" as const,
    };

    let cuti;

    if (dcuti) {
      cuti = await prisma.cuti.update({
        where: {
          id: dcuti.id,
        },
        data: payload,
      });
    } else {
      cuti = await prisma.cuti.create({
        data: payload,
      });
    }

    // Kirim notifikasi ke Atasan 1
    try {
      if (atasan1Nip) {
        await kirimNotifikasiKeNip({
          nip: atasan1Nip,
          title: "Pengajuan Cuti Baru",
          message: `${userNama} (${userJabatan}) mengajukan cuti dan memerlukan persetujuan Anda.`,
          link: "/dashboard/cuti",
        });
      }
    } catch (_) {}

    return NextResponse.json(cuti, { status: 201 });
  } catch (error: any) {
    console.error("Upload error:", error);

    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const {pegawaiId:meId} =  (session.user as any);
  try {
    const formData = await req.formData();

    const status = formData.get("status") as string;
    const alasanPenolakan = formData.get("alasanPenolakan") as string;
    const id = formData.get("id") as string;
    const atasanStatus = formData.get("atasanStatus") as string;
    
    
    const me = await prisma.pegawai.findUnique({
      where: { id: meId }
    });

    const dcuti = await prisma.cuti.findFirst({
      where: {
        id,
        status: {
          not: "DISETUJUI",
        },
      },
    });

    if (!dcuti) {
      return NextResponse.json({ error: "Data cuti tidak ditemukan" }, { status: 404 });
    }

    let payload: any = {
      status: status.toUpperCase(),
      alasanPenolakan: alasanPenolakan,
    }

    const tt = JSON.parse(dcuti.tt);
    const { atasan1Nip, atasan2Nip} = tt ;
    switch (atasanStatus) {
      case "1":
        if(me?.nip == atasan1Nip){
          payload={
            tt:JSON.stringify({...tt, atasan1Status:status.toUpperCase(), atasan1Penolakan:alasanPenolakan,}),
            status:(status == "Ditolak" ? "DITOLAK_ATASAN_1":"MENUNGGU_ATASAN_2"),
            alasanPenolakan:alasanPenolakan,
          }
        }
      break;
      case "2":
        if(me?.nip == atasan2Nip){
          payload={
            tt:JSON.stringify({...tt, atasan2Status:status.toUpperCase(),atasan2Penolakan:alasanPenolakan}),
            status:(status == "Ditolak" ? "DITOLAK_ATASAN_2":"MENUNGGU_ADMIN"),
            alasanPenolakan:alasanPenolakan,
          }
        }
      break;
    }
    const cuti = await prisma.cuti.update({
      data: payload,
      where:{
        id,
        status: {
          not: "DISETUJUI",
        },
      }
    });

    // Kirim notifikasi berdasarkan perubahan status
    try {
      const ttData = JSON.parse(cuti.tt);
      const namaAtasan = me?.nama ?? "Atasan";

      if (cuti.status === "MENUNGGU_ATASAN_2") {
        // Atasan 1 setujui → beri tahu pegawai dan Atasan 2
        await kirimNotifikasiKePegawaiId({
          pegawaiId: cuti.pegawaiId,
          title: "Cuti Disetujui Atasan 1",
          message: `Pengajuan cuti Anda disetujui oleh ${namaAtasan}. Menunggu persetujuan Atasan 2.`,
          link: "/dashboard/cuti",
        });
        if (ttData?.atasan2Nip) {
          await kirimNotifikasiKeNip({
            nip: ttData.atasan2Nip,
            title: "Pengajuan Cuti Menunggu Persetujuan",
            message: `${ttData?.userNama ?? "Pegawai"} memerlukan persetujuan cuti Anda.`,
            link: "/dashboard/cuti",
          });
        }
      } else if (cuti.status === "DITOLAK_ATASAN_1") {
        await kirimNotifikasiKePegawaiId({
          pegawaiId: cuti.pegawaiId,
          title: "Pengajuan Cuti Ditolak",
          message: `Pengajuan cuti Anda ditolak oleh ${namaAtasan}.${alasanPenolakan ? ` Alasan: ${alasanPenolakan}` : ""}`,
          link: "/dashboard/cuti",
        });
      } else if (cuti.status === "MENUNGGU_ADMIN") {
        await kirimNotifikasiKePegawaiId({
          pegawaiId: cuti.pegawaiId,
          title: "Cuti Disetujui Atasan 2",
          message: `Pengajuan cuti Anda disetujui oleh ${namaAtasan}. Menunggu proses Admin.`,
          link: "/dashboard/cuti",
        });
        // Beri tahu Admin (Kasubbag/KABAG_UMUM_KEPEGAWAIAN)
        const admins = await prisma.user.findMany({ where: { role: "KABAG_UMUM_KEPEGAWAIAN" } });
        for (const admin of admins) {
          const { kirimNotifikasi } = await import("@/lib/notifikasi");
          await kirimNotifikasi({
            userId: admin.id,
            title: "Cuti Siap Diproses",
            message: `Pengajuan cuti atas nama ${ttData?.userNama ?? "pegawai"} telah disetujui semua atasan dan siap untuk diproses.`,
            link: "/dashboard/cuti",
          });
        }
      } else if (cuti.status === "DITOLAK_ATASAN_2") {
        await kirimNotifikasiKePegawaiId({
          pegawaiId: cuti.pegawaiId,
          title: "Pengajuan Cuti Ditolak",
          message: `Pengajuan cuti Anda ditolak oleh ${namaAtasan}.${alasanPenolakan ? ` Alasan: ${alasanPenolakan}` : ""}`,
          link: "/dashboard/cuti",
        });
      }
    } catch (_) {}

    return NextResponse.json(cuti, { status: 201 });
  } catch (error: any) {
    console.error("Upload error:", error);

    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
