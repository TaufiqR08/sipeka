import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { 
  CalendarDays, 
  TrendingUp, 
  Star, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  UserCheck
} from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { isAdmin,isKabid,isPegawai,formatDateShort, getRemainingDays} from "@/lib/sfBGS"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
    const user = session?.user as any;
    const { role, pegawaiId,bidangId, nama } = user; 
  
    const isManagement =isAdmin(role);
    let whereClause: any = {};
    const me = await prisma.pegawai.findUnique({
      where: { id: pegawaiId },
      include:{ cuti:true}
    });
  
    if (isPegawai(role)) {
      whereClause.id = pegawaiId;
    }else if(isKabid(role)){
      whereClause.bidangId =me?.bidangId;
    }
    
    const rawData = await prisma.pegawai.findMany({
      where:whereClause,
      include:{
        cuti:true,
        layananPegawai:true,
      }
    })


    // const notif = await prisma.notification.findMany({
    //   where:{
    //     pegawaiId:me?.id
    //   },
    //   take:5,
    //   orderBy:{createdAt:"desc"}
    // })
    // Map to format expected by CutiList
    // const displayData = rawData.map(item => ({
    //   id: item.id,
    //   nama:item.nama,
    //   nip:item.nip,
    //   kgb:getRemainingDays(item.tglMasaKerja, 2).remainingDays,
    //   kp: getRemainingDays(item.tmtGolongan, 4).remainingDays,
    //   cutiT:item.cuti.length,
    //   layanan:item.layananPegawai.length,
    //   jabatan: item.jabatan
    // }));
   
  return (
    <ProtectedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Selamat datang kembali, <span className="font-semibold text-blue-600">{nama}</span>! 
            {isManagement ? " Berikut adalah ringkasan operasional kepegawaian." : " Berikut adalah ringkasan aktivitas Anda."}
          </p>
        </div>

        {/* Stats Cards - Dynamic based on role */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {isManagement ? (
            <>
              {/* Stats for Management */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Pending Approvals</p>
                    <p className="text-2xl font-bold text-orange-600 mt-2">12</p>
                    <p className="text-gray-500 text-xs mt-1">Perlu tindakan segera</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <UserCheck size={24} className="text-orange-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Pegawai</p>
                    <p className="text-2xl font-bold text-blue-900 mt-2">142</p>
                    <p className="text-green-600 text-xs mt-1">98% Aktif</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users size={24} className="text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Pengajuan Cuti</p>
                    <p className="text-2xl font-bold text-purple-600 mt-2">8</p>
                    <p className="text-gray-500 text-xs mt-1">Minggu ini</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CalendarDays size={24} className="text-purple-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Usulan KGB</p>
                    <p className="text-2xl font-bold text-green-600 mt-2">5</p>
                    <p className="text-gray-500 text-xs mt-1">Bulan Mei</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp size={24} className="text-green-600" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Stats for Pegawai */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Sisa Cuti</p>
                    <p className="text-2xl font-bold text-blue-600 mt-2">{me?.cuti.length >0 ? (12-me?.cuti.length):"12"}</p>
                    <p className="text-gray-500 text-xs mt-1">Hari (Tahunan)</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CalendarDays size={24} className="text-blue-600" />
                  </div>
                </div>
              </div> 
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">KGB Berikutnya</p>
                    <p className="text-lg font-bold text-gray-900 mt-2">{getRemainingDays(me?.tglMasaKerja, 2).remainingDays} hari</p>
                    <p className="text-gray-500 text-xs mt-1">Estimasi waktu</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp size={24} className="text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">KP Berikutnya</p>
                    <p className="text-lg font-bold text-gray-900 mt-2">{getRemainingDays(me?.tmtGolongan, 4).remainingDays} hari</p>
                    <p className="text-gray-500 text-xs mt-1">Estimasi waktu</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp size={24} className="text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Pangkat</p>
                    <p className="text-lg font-bold text-gray-900 mt-2">III/b</p>
                    <p className="text-gray-500 text-xs mt-1">Penata Muda Tk.I</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Star size={24} className="text-purple-600" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Latest Submissions / Approvals */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {isManagement ? "Persetujuan Menunggu" : "Pengajuan Saya"}
            </h2>
            <div className="space-y-3">
              {/*
                { name: "Ahmad Wijaya", type: "Kenaikan Pangkat", date: "1 minggu lalu", status: "Menunggu" },
                { name: "Cuti Tahunan", type: "Libur Keluarga", date: "2 hari lalu", status: "Menunggu" }, 
              */}
              {(!isManagement
                ? me?.cuti
                    .filter(v => v.status != "DISETUJUI")
                    .map(v => ({
                      name: v.jenisCuti,
                      type: v.alasan,
                      date: formatDateShort(v.createdAt),
                      status: v.status,
                    }))
                : []
              ).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-600">{item.type}</p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        item.status === "Disetujui"
                          ? "bg-green-100 text-green-700"
                          : item.status === "Diproses"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status}
                    </span>

                    <p className="text-xs text-gray-600 mt-1">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/dashboard/cuti" className="block text-center mt-4 text-sm text-blue-600 hover:underline">
              Lihat Semua
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
            <div className="space-y-2">
              <Link href="/dashboard/cuti/baru" className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-blue-600 font-medium text-sm">
                <span>Buat Pengajuan Cuti</span>
                <span>→</span>
              </Link>
              {isManagement && (
                <Link href="/dashboard/pegawai" className="flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-purple-600 font-medium text-sm">
                  <span>Kelola Pegawai</span>
                  <span>→</span>
                </Link>
              )}
              <Link href="/dashboard/layanan/kgb" className="flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-green-600 font-medium text-sm">
                <span>Daftar KGB</span>
                <span>→</span>
              </Link>
              <Link href="/dashboard/layanan/kp" className="flex items-center justify-between p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors text-yellow-600 font-medium text-sm">
                <span>Usulan Pangkat</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
              <AlertCircle size={20} />
              Informasi Sistem
            </h3>
            <p className="text-blue-100">
              {isManagement 
                ? "Terdapat 12 pengajuan yang memerlukan persetujuan Anda hari ini. Segera tindak lanjuti untuk menjaga kelancaran administrasi."
                : `Sisa jatah cuti tahunan Anda adalah 12 hari. Pastikan pengajuan dilakukan paling lambat 3 hari sebelum tanggal mulai.`
              }
            </p>
          </div>
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
