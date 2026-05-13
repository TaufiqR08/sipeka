import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { Plus } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import LFormEntri from "@/components/Layanan/LFormEntri"
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getRemainingDays, isAdmin } from "@/lib/sfBGS";

export default async function LayananPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const { role, pegawaiId,bidangId } = user; 
  
  
  const kategori = await prisma.kategoriDokumen.findUnique({
    where: { idKate: params.id }
  });
  if (!kategori) {
    return "Maaf, salah layanan"
  }

 

  const Opegawai = await prisma.pegawai.findUnique({
    where:{
      id:user.pegawaiId
    }
  });

  let masaPengajuan = {};
  if(params.id == "KGB"){
    masaPengajuan = getRemainingDays(Opegawai?.tglMasaKerja,2)
  }else{
    masaPengajuan = getRemainingDays(Opegawai?.tmtGolongan,4)
  }
  const on = masaPengajuan.remainingDays<90; 

  let dlayanan = await prisma.layanan.findFirst({
      where: {
          idKate: params.id,
          pimpinanId: pegawaiId,
          aktif: true,
      },
  });

  if (!dlayanan && on) {
      dlayanan = await prisma.layanan.create({
          data: {
              idKate: params.id,
              pimpinanId: pegawaiId,
              aktif: true,
          },
      });
  }

   const ddokument = await prisma.daftarDokumen.findMany({
    where: { idKate: params.id },
    include:{
      listDokumen:{
        where:{ idLaya:dlayanan?.idLaya }
      } 
    }
  });  
  
  
  return (
    <ProtectedLayout>
      <LFormEntri
        sf={{
          ...masaPengajuan,
          ...kategori,
          on,
          isAdmin:isAdmin(role)
        }}
        dlayanan={dlayanan}
        ddokument={ddokument}
      />
    </ProtectedLayout>
  );
}
