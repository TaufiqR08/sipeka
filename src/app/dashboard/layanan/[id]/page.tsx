import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { Plus } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Ltabel from "@/components/Layanan/Ltable"
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { isAdmin,isKabid,isPegawai } from "@/lib/sfBGS"

export default async function LayananPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const { role, pegawaiId,bidangId } = user; 
  
  const realAdmin =isAdmin(role);

  const kategori = await prisma.kategoriDokumen.findUnique({
    where: { idKate: params.id }
  });
  if (!kategori) {
    return "Maaf, salah layanan"
  }


  let whereClause: any = {
    aktif:true,
    idKate: params.id,
  };
  const me = await prisma.pegawai.findUnique({
    where: { id: pegawaiId }
  });
  
  if (isPegawai(role)) {
    whereClause.pimpinanId = pegawaiId;
  }else if(isKabid(role)){
    const pegawaiBidang = await prisma.pegawai.findMany({
      where: { bidangId:me?.bidangId }
    });
    whereClause.pimpinanId ={
      in: pegawaiBidang.map(v=>v.id)
    }
  }
  
  
  
  const dtabel = await prisma.layanan.findMany({
    where: whereClause,
    include:{
      pimpinan:true,
      listDokumen:true
    }
  });

  const ddokument = await prisma.daftarDokumen.findMany({
    where: { idKate: params.id },
  });
  
  

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {kategori.nmKate}
            </h1>
            <p className="text-gray-600 mt-2">
              {kategori.ket}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
                href={"/dashboard/layanan/"+kategori.idKate+"/riwayat"}
                className="px-6 py-2 border border-gray-300 rounded-lg bg-green-800 text-white font-medium hover:bg-green-10 transition-colors"
              >
                Riwayat Pengajuan
              </Link>
            <Link 
              href={"/dashboard/layanan/"+kategori.idKate+"/new"}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-md hover:shadow-lg active:scale-95 self-start"
            >
              <Plus size={20} />
              Buat Pengajuan {kategori.idKate}
            </Link>
          </div>
          
        </div>

        <Ltabel dtabel={dtabel} ddokument={ddokument} 
          sf={{
            ...kategori,
          }}
        />

      </div>
    </ProtectedLayout>
  );
}
