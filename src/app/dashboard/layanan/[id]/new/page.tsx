import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { Plus } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import LFormEntri from "@/components/Layanan/LFormEntri"
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getRemainingDays, isAdmin, _notif } from "@/lib/sfBGS";

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

  // Layanan belum ada → buat baru dan kirim notif ke admin
  if (!dlayanan && on) {
      dlayanan = await prisma.layanan.create({
          data: {
              idKate: params.id,
              pimpinanId: pegawaiId,
              aktif: true,
          },
      });

      // Cari akun admin untuk menerima notifikasi
      const adminUser = await prisma.user.findFirst({
        where: { role: "ADMIN" },
      });
      if (adminUser?.pegawaiId) {
        const jenis = params.id === "KGB" ? "Kenaikan Gaji Berkala" : "Kenaikan Pangkat";
        _notif({
          title: `Pengajuan ${jenis}, a.n ${Opegawai?.nama ?? "Pegawai"}`,
          message: `Pegawai ${Opegawai?.nama ?? ""} (NIP: ${Opegawai?.nip ?? ""}) telah mengajukan ${jenis}. Mohon periksa kelengkapan dokumen di Aplikasi SIPEKA.`,
          pegawaiId: adminUser.pegawaiId,
          idLaya: dlayanan?.idLaya ?? null,
          sumber: params.id as "KGB" | "KP",
          info: "BARU",
        });
      }
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
