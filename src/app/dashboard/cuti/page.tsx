import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { Plus, Calendar } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CutiList } from "./components/CutiList";
import { prisma } from "@/lib/prisma";
import { isAdmin,isKabid,isPegawai } from "@/lib/sfBGS"

export default async function CutiPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const { role, pegawaiId,bidangId } = user; 

  const realAdmin =isAdmin(role);
  let whereClause: any = {
    status:{
      not:"DISETUJUI"
    }
  };
  const me = await prisma.pegawai.findUnique({
    where: { id: pegawaiId }
  });

  if (isPegawai(role)) {
    whereClause.OR = [
      { pegawai: { id: pegawaiId } },
      { tt: { contains: me?.nip } }
    ];
  }else if(isKabid(role)){
    const pegawaiBidang = await prisma.pegawai.findMany({
      where: { bidangId:me?.bidangId }
    });
    whereClause.OR = [
      {
        pegawai: {
          id: {
            in: pegawaiBidang.map(v=>v.id)
          }
        }
      },
      {
        tt: { contains: me?.nip }
      }
    ];
  }

  const rawData = await prisma.cuti.findMany({
    where:whereClause,
    include: {
      pegawai: {
        select: {
          nama: true,
          nip: true,
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  // Map to format expected by CutiList
  const displayData = rawData.map(item => ({
    id: item.id,
    pegawai: item.pegawai.nama,
    nip: item.pegawai.nip,
    jenisCuti: item.jenisCuti.replace(/_/g, " "),
    tanggalMulai: item.tanggalMulai.toISOString().split("T")[0],
    tanggalSelesai: item.tanggalSelesai.toISOString().split("T")[0],
    jumlahHari: item.jumlahHari,
    status: item.status.replace(/_/g, " "),
    statusr:item.status,
    alasanPenolakan: item.alasanPenolakan,
    alasan: item.alasan,
    alasanSpesifik: item.alasanSpesifik,
    pegawaiId:item.pegawaiId,
    ...JSON.parse(item.tt)
  }));

  

  // console.log(displayData,me);
  
  return (
    <ProtectedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {realAdmin || isKabid(role) ? "Manajemen Pengajuan Cuti" : "Pengajuan Cuti Saya"}
            </h1>
            <p className="text-gray-600 mt-2">
              {realAdmin || isKabid(role)
                ? "Daftar seluruh pengajuan cuti pegawai yang memerlukan tinjauan." 
                : "Kelola dan pantau status pengajuan cuti Anda."}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
                href="/dashboard/cuti/riwayat"
                className="px-6 py-2 border border-gray-300 rounded-lg bg-green-800 text-white font-medium hover:bg-green-10 transition-colors"
              >
                Riwayat Pengajuan
              </Link>
            <Link 
              href="/dashboard/cuti/baru"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-md hover:shadow-lg active:scale-95 self-start"
            >
              <Plus size={20} />
              Pengajuan Baru
            </Link>
          </div>
        </div>

        {/* Stats */}
        {
          !realAdmin && 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <p className="text-gray-500 text-sm font-medium">Progress Pengajuan</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{displayData.length}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <p className="text-gray-500 text-sm font-medium">
                {realAdmin ? "Menunggu Persetujuan" : "Sisa Cuti Tahunan"}
              </p>
              <p className={`text-2xl font-bold mt-1 ${realAdmin ? "text-yellow-600" : "text-blue-600"}`}>
                {realAdmin 
                  ? displayData.filter(p => p.status.includes("MENUNGGU") || p.status.includes("Menunggu")).length 
                  : "12 hari"}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <p className="text-gray-500 text-sm font-medium">Disetujui Bulan Ini</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {displayData.filter(p => p.status === "DISETUJUI" || p.status === "Disetujui").length}
              </p>
            </div>
          </div>
        }

        {/* Table Content */}
        <CutiList data={displayData} 
          me={{
            ...me,
            realAdmin,
            role
          }} 
        />

        {/* Empty State */}
        {displayData.length === 0 && (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} className="text-gray-300" />
            </div>
            <h3 className="text-gray-900 font-bold text-lg">Tidak Ada Data</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">
              {realAdmin 
                ? "Saat ini tidak ada pengajuan cuti dari pegawai." 
                : "Anda belum memiliki riwayat pengajuan cuti."}
            </p>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
