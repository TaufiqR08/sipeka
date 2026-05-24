// src/app/api/pegawai/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET — daftar pegawai sesuai level akses
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role, pegawaiId, bidang } = session.user as any;
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const filterBidang = searchParams.get("bidang");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 12;

  let whereClause: any = {};

  // Filter pencarian
  if (search) {
    whereClause.OR = [
      { nama: { contains: search } },
      { nip: { contains: search } },
      { jabatan: { contains: search } },
    ];
  }
  if (filterBidang) whereClause.bidang = filterBidang;

  // Batasan akses berdasarkan role
  if (role === "PEGAWAI") {
    // Pegawai hanya bisa lihat profil sendiri
    whereClause.id = pegawaiId;
  } else if (role === "KEPALA_BIDANG") {
    // Kepala Bidang hanya lihat pegawai di bidangnya
    whereClause.bidang = bidang;
    whereClause.user = {
      role: { notIn: ["KEPALA_BADAN", "SEKRETARIS_BADAN", "KABAG_UMUM_KEPEGAWAIAN"] }
    };
  } else if (role === "KABAG_UMUM_KEPEGAWAIAN") {
    // Kabag bisa lihat semua kecuali pimpinan
    whereClause.user = {
      role: { notIn: ["KEPALA_BADAN", "SEKRETARIS_BADAN"] }
    };
  }
  // ADMIN, KEPALA_BADAN, SEKRETARIS_BADAN → lihat semua

  const [data, total] = await Promise.all([
    prisma.pegawai.findMany({
      where: whereClause,
      select: {
        id: true,
        nip: true,
        nama: true,
        jabatan: true,
        bidang: true,
        golonganRuang: true,
        statusPegawai: true,
        fotoUrl: true,
        user: { select: { role: true } },
      },
      orderBy: { nama: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.pegawai.count({ where: whereClause }),
  ]);

  return NextResponse.json({ data, total, page, totalPages: Math.ceil(total / limit) });
}

// POST — tambah pegawai baru (hanya ADMIN & KABAG)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role } = session.user as any;
  if (!["ADMIN", "KABAG_UMUM_KEPEGAWAIAN"].includes(role)) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const body = await req.json();
  const pegawai = await prisma.pegawai.create({ data: body });
  return NextResponse.json(pegawai, { status: 201 });
}
