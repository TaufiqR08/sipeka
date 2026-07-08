import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir  } from "fs/promises";
import { join } from "path";
import { StatusPengajuan } from "@prisma/client";
import { _notif } from "@/lib/sfBGS"

// GET — ambil semua cuti (sesuai level akses)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role, nip, bidang } = session.user as any;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 10;

  let whereClause: any = {};

  if (status) whereClause.status = status;

  // Filter berdasarkan level akses
  if (role === "PEGAWAI") {
    whereClause.pegawai = { nip };
  } else if (role === "KEPALA_BIDANG") {
    whereClause.pegawai = { bidang };
  } else if (role === "KABAG_UMUM_KEPEGAWAIAN") {
    whereClause.pegawai = {
      role: { notIn: ["KEPALA_BADAN", "SEKRETARIS_BADAN"] }
    };
  }

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
    const alasanSpesifik = formData.get("alasanSpesifik") as string | null;
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

    const all =await prisma.pegawai.findMany();
    const pegawai = all.filter(v=>v.id == pegawaiId)[0]; 
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
      alasanSpesifik: alasanSpesifik || "",
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
      status: StatusPengajuan.MENUNGGU_ATASAN_1,
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
    
    const ats1 = all.filter(v=>v.nip == atasan1Nip)[0]; 
    // const ats2 = all.filter(v=>v.nip == atasan2Nip)[0]; 
    if(ats1){
      _notif({
        title:"Pengajuan Cuti, a.n "+pegawai.nama,
        message:`Yth. ${ats1.nama} selaku ${ats1.jabatan}, kami mohon persetujuaannya, informasi lengkapnya ada di Aplikasi SIPEKA `,
        pegawaiId:ats1.id,
        cutiId:cuti?.id || "-",
        sumber:"CUTI",
        info:"MENUNGGU_ATASAN_1",
        idLaya:null
      })
    }
    // if(ats2){
    //   // _notif()
    // }

    return NextResponse.json(cuti, { status: 201 });
  } catch (error: any) {
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
    
    const admin = await prisma.user.findFirst({
      where:{
        role:"ADMIN"
      }
    })

    const all =await prisma.pegawai.findMany();
    const me = all.filter(v=>v.id == meId)[0]; 
    

    const dcuti = await prisma.cuti.findFirst({
      where: {
        id,
        status: {
          not: "DISETUJUI",
        },
      },
    });

    let payload: any = {
      status: status.toUpperCase(),
      alasanPenolakan: alasanPenolakan,
    };
    const tt = JSON.parse(dcuti?.tt || "{}");
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
      data: payload, //
      where:{
        id,
        status: {
          not: "DISETUJUI",
        },
      }
    });

    const ats1 = all.filter(v=>v.nip == atasan1Nip)[0]; 
    const ats2 = all.filter(v=>v.nip == atasan2Nip)[0]; 
    const real = all.filter(v=>v.id == dcuti?.pegawaiId)[0]; 
    const adminR = all.filter(v=>v.id == admin?.pegawaiId)[0]; 

    // console.log(cuti);
    
    switch (cuti?.status) {
      case "DITOLAK_ATASAN_1":
        if(real){
          _notif({
            title:"PENOLAKAN Pengajuan Cuti, Oleh "+ats1.nama,
            message:alasanPenolakan+`, informasi lengkapnya ada di Aplikasi SIPEKA `,
            pegawaiId:real.id,
            cutiId:cuti?.id || "-",
            sumber:"CUTI",
            info:"DITOLAK_ATASAN_1",
            idLaya:null
          });
        }
      break;
      case "MENUNGGU_ATASAN_2":
        if(real){
          _notif({
            title:"Pengajuan Cuti DISETUJUI, Oleh "+ats1.nama,
            message:`Selamat, informasi lengkapnya ada di Aplikasi SIPEKA `,
            pegawaiId:real.id,
            cutiId:cuti?.id || "-",
            sumber:"CUTI",
            info:"MENUNGGU_ATASAN_2",
            idLaya:null
          });
        }
        if(ats2){
          _notif({
            title:"Pengajuan Cuti, a.n "+real.nama,
            message:`Yth. ${ats2.nama} selaku ${ats2.jabatan}, kami mohon persetujuaannya, informasi lengkapnya ada di Aplikasi SIPEKA `,
            pegawaiId:ats2.id,
            cutiId:cuti?.id || "-",
            sumber:"CUTI",
            info:"MENUNGGU_ATASAN_2 -" // - pembeda antara atasan 1 dan 2
            ,idLaya:null
          })
        }
      break;
      case "DITOLAK_ATASAN_2":
        if(real){
          _notif({
            title:"PENOLAKAN Pengajuan Cuti, Oleh "+ats2.nama,
            message:alasanPenolakan+`, informasi lengkapnya ada di Aplikasi SIPEKA `,
            pegawaiId:real.id,
            cutiId:cuti?.id || "-",
            sumber:"CUTI",
            info:"DITOLAK_ATASAN_2",
            idLaya:null
          });
        }
      break;
      case "MENUNGGU_ADMIN":
        if(real){
          _notif({
            title:"Pengajuan Cuti DISETUJUI, Oleh "+ats2.nama,
            message:`Selamat, informasi lengkapnya ada di Aplikasi SIPEKA `,
            pegawaiId:real.id,
            cutiId:cuti?.id || "-",
            sumber:"CUTI",
            info:"MENUNGGU_ADMIN",
            idLaya:null
          });
        }
        if(adminR){
          _notif({
            title:"Pengajuan Cuti, a.n "+real.nama,
            message:`telah disetujui atasan, mohon untuk menyelsaikan pengajuan ini, informasi lengkapnya ada di Aplikasi SIPEKA `,
            pegawaiId:adminR.id,
            cutiId:cuti?.id || "-",
            sumber:"CUTI",
            info:"MENUNGGU_ADMIN -" // - pembeda antara atasan 1 dan 2
            ,idLaya:null
          })
        }
      break;
      case "DISETUJUI":
        if(real){
          _notif({
            title:"Pengajuan Cuti DISETUJUI, Oleh ADMIN",
            message:`Selamat, informasi lengkapnya ada di Aplikasi SIPEKA `,
            pegawaiId:real.id,
            cutiId:cuti?.id || "-",
            sumber:"CUTI",
            info:"DISETUJUI",
            idLaya:null
          });
        }
      break
    } 
    return NextResponse.json(cuti, { status: 201 });
  } catch (error: any) {
    console.error("Upload error:", error);

    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
