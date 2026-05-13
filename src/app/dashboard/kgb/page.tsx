import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { Plus, TrendingUp, CheckCircle, Clock, Upload } from "lucide-react";
import Link from "next/link";

export default function KGBPage() {
  const pengajuanKGB = [
    {
      id: 1,
      tahun: 2024,
      golonganRuang: "III/d",
      tanggalAjuan: "2024-03-15",
      status: "Centang",
      dokumen: true,
    },
    {
      id: 2,
      tahun: 2023,
      golonganRuang: "III/c",
      tanggalAjuan: "2023-03-20",
      status: "Disetujui",
      dokumen: true,
    },
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      Centang: "bg-green-100 text-green-700",
      Disetujui: "bg-green-100 text-green-700",
      Menunggu: "bg-yellow-100 text-yellow-700",
    };
    return badges[status as keyof typeof badges] || "";
  };

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Kenaikan Gaji Berkala
            </h1>
            <p className="text-gray-600 mt-2">
              Kelola pengajuan KGB dan upload dokumen pendukung
            </p>
          </div>
          <Link 
            href="/dashboard/cuti/baru"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-md hover:shadow-lg active:scale-95 self-start"
          >
            <Plus size={20} />
            Buat Pengajuan Baru
          </Link>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-gray-600 text-sm">Total KGB</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-gray-600 text-sm">Golongan Saat Ini</p>
            <p className="text-2xl font-bold text-green-600 mt-1">III/d</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-gray-600 text-sm">Golongan Berikutnya</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">IV/a</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Tahun
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Golongan Ruang
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Tanggal Ajuan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Dokumen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pengajuanKGB.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {item.tahun}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.golonganRuang}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.tanggalAjuan}
                    </td>
                    <td className="px-6 py-4">
                      {item.dokumen ? (
                        <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded text-xs font-semibold">
                          <CheckCircle size={14} />
                          Lengkap
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-yellow-700 bg-yellow-100 px-2 py-1 rounded text-xs font-semibold">
                          <Upload size={14} />
                          Belum Upload
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(item.status)}`}
                      >
                        {item.status === "Centang" ? (
                          <CheckCircle size={14} />
                        ) : (
                          <Clock size={14} />
                        )}
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                          Lihat
                        </button>
                        {!item.dokumen && (
                          <button className="text-green-600 hover:text-green-700 font-medium">
                            Upload
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>📌 Catatan:</strong> Pastikan dokumen pendukung KGB Anda
            telah di-upload. Status akan berubah menjadi "Centang" setelah
            dokumen diterima.
          </p>
        </div>
      </div>
    </ProtectedLayout>
  );
}
