import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/sfBGS";

// GET — ambil notifikasi dengan pagination, filter, search
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as any;
  const { pegawaiId, role } = user;

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const sumber = searchParams.get("sumber"); // CUTI | KGB | KP
  const status = searchParams.get("status"); // read | unread
  const search = searchParams.get("search");

  // Build where clause
  const where: any = {};

  // Role-based: admin melihat semua, pegawai hanya miliknya
  if (!isAdmin(role)) {
    where.pegawaiId = pegawaiId;
  }

  // Filter by sumber
  if (sumber && ["CUTI", "KGB", "KP"].includes(sumber)) {
    where.sumber = sumber;
  }

  // Filter by status baca
  if (status === "read") {
    where.send = true;
  } else if (status === "unread") {
    where.send = false;
  }

  // Search title or message
  if (search && search.trim()) {
    where.OR = [
      { title: { contains: search.trim() } },
      { message: { contains: search.trim() } },
    ];
  }

  const skip = (page - 1) * limit;

  const [notifications, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        pegawai: {
          select: { nama: true, nip: true },
        },
      },
    }),
    prisma.notification.count({ where }),
    prisma.notification.count({
      where: {
        ...(isAdmin(role) ? {} : { pegawaiId }),
        send: false,
      },
    }),
  ]);

  return NextResponse.json({
    notifications,
    unreadCount,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

// PATCH — tandai notifikasi sebagai sudah dibaca
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as any;
  const { pegawaiId, role } = user;
  const body = await req.json().catch(() => ({}));
  const { id } = body;

  if (id) {
    // Tandai satu notifikasi
    await prisma.notification.update({
      where: { id },
      data: { send: true },
    });
  } else {
    // Tandai semua milik user ini (atau semua jika admin)
    const updateWhere: any = { send: false };
    if (!isAdmin(role)) {
      updateWhere.pegawaiId = pegawaiId;
    }
    await prisma.notification.updateMany({
      where: updateWhere,
      data: { send: true },
    });
  }

  return NextResponse.json({ success: true });
}