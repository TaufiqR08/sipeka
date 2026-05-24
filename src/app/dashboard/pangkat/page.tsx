import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { Plus, Star, CheckCircle, Clock, Upload } from "lucide-react";

export default function PangkatPage() {
  const pengajuanPangkat = [
    {
      id: 1,
      jenisPangkat: "Kenaikan Pangkat Reguler",
      pangkatAwal: "Penata Muda III/b",
      pangkatTujuan: "Penata III/c",
      tanggalAjuan: "2024-04-10",
      status: "Diproses",
      dokumen: true,
    },
    {
      id: 2,
      jenisPangkat: "Kenaikan Pangkat Pilihan",
      pangkatAwal: "Penata III/c",
      pangkatTujuan: "Penata Tingkat I III/d",
      tanggalAjuan: "2024-02-15",
      status: "Centang",
      dokumen: true,
    },
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      Centang: "bg-green-100 text-green-700",
      Diproses: "bg-blue-100 text-blue-700",
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
              Kenaikan Pangkat
            </h1>
            <p className="text-gray-600 mt-2">
              Kelola pengajuan kenaikan pangkat dan dokumen pendukung
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium">
            <Plus size={20} />
            Ajukan Kenaikan Pangkat
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-gray-600 text-sm">Total Pengajuan</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-gray-600 text-sm">Pangkat Saat Ini</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">III/c</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-gray-600 text-sm">Dalam Proses</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">1</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Jenis Pangkat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Dari → Ke
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
                {pengajuanPangkat.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {item.jenisPangkat}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 font-medium">
                          {item.pangkatAwal}
                        </span>
                        <span className="text-gray-400">→</span>
                        <span className="text-blue-600 font-medium">
                          {item.pangkatTujuan}
                        </span>
                      </div>
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
                        {item.status === "Centang" ||
                        item.status === "Diproses" ? (
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

        {/* Timeline Info */}
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            📋 Proses Persetujuan Kenaikan Pangkat
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>1. Periksa kelengkapan dokumen pendukung</p>
            <p>2. Upload semua dokumen yang diperlukan</p>
            <p>3. Ajukan ke atasan langsung (Kepala Bidang)</p>
            <p>4. Ditinjau oleh Kepala Badan dan Sekretaris Daerah</p>
            <p>5. Pengumuman hasil pengajuan</p>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
