import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { Plus, Calendar } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Ptable from "@/components/pegawai/Ptable"
import { prisma } from "@/lib/prisma";
import { isAdmin,isKabid,isPegawai, getRemainingDays} from "@/lib/sfBGS"

export default async function CutiPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const { role, pegawaiId,bidangId } = user; 

  const realAdmin =isAdmin(role);
  let whereClause: any = {};
  const me = await prisma.pegawai.findUnique({
    where: { id: pegawaiId }
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
  // Map to format expected by CutiList
  const displayData = rawData.map(item => ({
    id: item.id,
    nama:item.nama,
    nip:item.nip,
    kgb:getRemainingDays(item.tglMasaKerja, 2).remainingDays,
    kp: getRemainingDays(item.tmtGolongan, 4).remainingDays,
    cutiT:item.cuti.length,
    layanan:item.layananPegawai.length,
    jabatan: item.jabatan
  }));

  

  // console.log(displayData,me);
  
  return (
    <ProtectedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Manajemen Pegawai
            </h1>
            <p className="text-gray-600 mt-2">
              Data Pegawai
            </p>
          </div>
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div> */}
        </div>

        {/* Stats */}
        {/* {
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
        } */}

        {/* Table Content */}
        <Ptable dtabel={displayData} sf={{}}  />

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


// import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
// import { Search, Filter, Download, Users } from "lucide-react";

// export default function PegawaiPage() {
//   const pegawaiList = [
//     {
//       id: 1,
//       nama: "Budi Santoso",
//       nip: "197805122008121001",
//       jabatan: "Kepala Badan",
//       bidang: "Pimpinan",
//       golonganRuang: "IV/e",
//       status: "AKTIF",
//     },
//     {
//       id: 2,
//       nama: "Siti Nurhaliza",
//       nip: "198203242010122002",
//       jabatan: "Sekretaris Badan",
//       bidang: "Sekretariat",
//       golonganRuang: "IV/d",
//       status: "AKTIF",
//     },
//     {
//       id: 3,
//       nama: "Ahmad Wijaya",
//       nip: "198512302012121003",
//       jabatan: "Kepala Bidang",
//       bidang: "Ideologi, Wawasan Kebangsaan, dan Karakter Bangsa",
//       golonganRuang: "IV/a",
//       status: "AKTIF",
//     },
//     {
//       id: 4,
//       nama: "Dewi Lestari",
//       nip: "199001152015122004",
//       jabatan: "Staf Ahli",
//       bidang: "Ideologi, Wawasan Kebangsaan, dan Karakter Bangsa",
//       golonganRuang: "III/c",
//       status: "AKTIF",
//     },
//     {
//       id: 5,
//       nama: "Roni Hermawan",
//       nip: "198707202013121005",
//       jabatan: "Fungsional Umum",
//       bidang: "Sekretariat",
//       golonganRuang: "III/b",
//       status: "AKTIF",
//     },
//   ];

//   return (
//     <ProtectedLayout>
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Data Pegawai</h1>
//             <p className="text-gray-600 mt-2">
//               Daftar lengkap pegawai Dinas Kesbangpol Sumbawa Barat
//             </p>
//           </div>
//           <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
//             <Download size={20} />
//             Export Data
//           </button>
//         </div>

//         {/* Search & Filter */}
//         <div className="flex gap-3">
//           <div className="flex-1 relative">
//             <Search
//               size={18}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//             />
//             <input
//               type="text"
//               placeholder="Cari pegawai berdasarkan nama atau NIP..."
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700">
//             <Filter size={18} />
//             Filter
//           </button>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="bg-white rounded-lg border border-gray-200 p-4">
//             <p className="text-gray-600 text-sm">Total Pegawai</p>
//             <p className="text-2xl font-bold text-gray-900 mt-1">142</p>
//           </div>
//           <div className="bg-white rounded-lg border border-gray-200 p-4">
//             <p className="text-gray-600 text-sm">Pegawai Aktif</p>
//             <p className="text-2xl font-bold text-green-600 mt-1">140</p>
//           </div>
//           <div className="bg-white rounded-lg border border-gray-200 p-4">
//             <p className="text-gray-600 text-sm">Cuti Besar</p>
//             <p className="text-2xl font-bold text-yellow-600 mt-1">1</p>
//           </div>
//           <div className="bg-white rounded-lg border border-gray-200 p-4">
//             <p className="text-gray-600 text-sm">Pensiun</p>
//             <p className="text-2xl font-bold text-gray-600 mt-1">1</p>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-gray-200 bg-gray-50">
//                   <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Nama
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     NIP
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Jabatan
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Bidang
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Golongan
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Aksi
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {pegawaiList.map((pegawai) => (
//                   <tr
//                     key={pegawai.id}
//                     className="hover:bg-gray-50 transition-colors"
//                   >
//                     <td className="px-6 py-4 text-sm font-medium text-gray-900">
//                       {pegawai.nama}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600 font-mono">
//                       {pegawai.nip}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600">
//                       {pegawai.jabatan}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
//                       {pegawai.bidang}
//                     </td>
//                     <td className="px-6 py-4 text-sm font-semibold text-gray-900">
//                       {pegawai.golonganRuang}
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
//                         {pegawai.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-sm">
//                       <button className="text-blue-600 hover:text-blue-700 font-medium">
//                         Lihat Detail
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Pagination */}
//         <div className="flex items-center justify-between">
//           <p className="text-sm text-gray-600">
//             Menampilkan 1-5 dari 142 pegawai
//           </p>
//           <div className="flex gap-2">
//             <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
//               ← Sebelumnya
//             </button>
//             <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
//               1
//             </button>
//             <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
//               2
//             </button>
//             <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
//               3
//             </button>
//             <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
//               Berikutnya →
//             </button>
//           </div>
//         </div>
//       </div>
//     </ProtectedLayout>
//   );
// }
