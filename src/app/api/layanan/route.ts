import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const {pegawaiId:meId} =  (session.user as any);
  try {
    const formData = await req.formData();

    const idLaya = formData.get("idLaya") as string;
    const aktif = formData.get("aktif") as string;
    
    
    const cuti = await prisma.layanan.update({
      data: {
        aktif:Boolean(Number(aktif))
      },
      where:{
        idLaya:idLaya
      }
    });

    return NextResponse.json(cuti, { status: 201 });
  } catch (error: any) {
    console.error("Upload error:", error);

    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}