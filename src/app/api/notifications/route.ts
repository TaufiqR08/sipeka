import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET — ambil notifikasi milik user yang sedang login
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  

    
  const notifications = await prisma.notification.findMany({
    where: { pegawaiId:userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const unreadCount = await prisma.notification.count({
    where: { pegawaiId:userId, send: true },
  });

  return NextResponse.json({ notifications, unreadCount });
}

// PATCH — tandai semua notifikasi sebagai sudah dibaca
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const body = await req.json().catch(() => ({}));
  const { id } = body;

  if (id) {
    // Tandai satu notifikasi
    await prisma.notification.update({
      where: { id },
      data: { send: true },
    });
  } else {
    // Tandai semua
    await prisma.notification.updateMany({
      where: { pegawaiId:userId, send: false },
      data: { send: true },
    });
  }

  return NextResponse.json({ success: true });
}