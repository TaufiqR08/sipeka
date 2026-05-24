"use client";

import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  FileText,
  User,
  Upload,
  Send,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function Fcuti({
  rawData,
  dcuti,
}: {
  rawData: Record<string, any>,
  dcuti: any
}) {

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    jenisCuti: "",
    alasan: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    jumlahHari: "",
    durasiJenis: "HARI",
    alamatSelama: "",
    userJabatan: "",
    userNama: "",
    userNip: "",
    atasan1Jabatan: "",
    atasan1Nama: "",
    atasan1Nip: "",
    atasan2Jabatan: "",
    atasan2Nama: "",
    atasan2Nip: "",
  });

  useEffect(() => {
    if (dcuti) {
      setFormData({
        jenisCuti: dcuti.jenisCuti || "",
        alasan: dcuti.alasan || "",
        tanggalMulai: dcuti.tanggalMulai
          ? new Date(dcuti.tanggalMulai).toISOString().split("T")[0]
          : "",
        tanggalSelesai: dcuti.tanggalSelesai
          ? new Date(dcuti.tanggalSelesai).toISOString().split("T")[0]
          : "",
        jumlahHari: dcuti.jumlahHari?.toString() || "",
        durasiJenis: dcuti.durasiJenis || "HARI",
        alamatSelama: dcuti.alamatSelama || "",
        userJabatan: dcuti.userJabatan || "",
        userNama: dcuti.userNama || "",
        userNip: dcuti.userNip || "",
        atasan1Jabatan: dcuti.atasan1Jabatan || "",
        atasan1Nama: dcuti.atasan1Nama || "",
        atasan1Nip: dcuti.atasan1Nip || "",
        atasan2Jabatan: dcuti.atasan2Jabatan || "",
        atasan2Nama: dcuti.atasan2Nama || "",
        atasan2Nip: dcuti.atasan2Nip || "",
      });
      setFile({name:dcuti.filePendukungUrl || ""})
    }
  }, [dcuti]);

  type Approval = {
    jab: string;
    nm: string;
    nip: string;
  };

  // =======================
  // APPROVAL ENGINE (FIXED)
  // =======================
  function getApprovalFlow(
    jenisCuti: string,
    jumlahHari: number,
    data: any
  ): Approval[] {
    const { user, bidang, dinas, bupati, wakil, bkd } = data;

    switch (jenisCuti) {
      case "TAHUNAN":
      case "ALASAN_PENTING":
        return [user, bidang, dinas];

      case "MELAHIRKAN":
        return [user, bidang, dinas];

      case "SAKIT":
        return jumlahHari <= 14
          ? [user, bidang, dinas]
          : [user, dinas, bkd];

      case "BESAR":
        return [user, dinas, bupati];

      default:
        return [user];
    }
  }
  const updateApproval = (data: any) => {
  const jumlahHari = Number(data.jumlahHari || 0);

  const flow = getApprovalFlow(
      data.jenisCuti,
      jumlahHari,
      rawData
    );

    const user = flow[0];
    const atasan1 = flow[1];
    const atasan2 = flow[2];

    return {
      ...data,
      userJabatan: user?.jab || "",
      userNama: user?.nm || "",
      userNip: user?.nip || "",

      atasan1Jabatan: atasan1?.jab || "",
      atasan1Nama: atasan1?.nm || "",
      atasan1Nip: atasan1?.nip || "",

      atasan2Jabatan: atasan2?.jab || "",
      atasan2Nama: atasan2?.nm || "",
      atasan2Nip: atasan2?.nip || "",
    };
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    const nextFormData = {
      ...formData,
      [name]: value,
    };

    // 👉 hanya recalculation kalau field penting berubah
    if (name === "jenisCuti" || name === "jumlahHari") {
      setFormData(updateApproval(nextFormData));
      return;
    }

    // 👉 selain itu (nama, alamat, dll) normal update
    setFormData(nextFormData);
  };
  // =======================
  // FILE HANDLER
  // =======================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const selectedFile = e.target.files[0];

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB");
      return;
    }

    setFile(selectedFile);
  };

  // =======================
  // SUBMIT (UNCHANGED LOGIC CLEAN)
  // =======================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value as string);
      });

      if (file) data.append("file", file);

      const res = await fetch("/api/cuti", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal mengirim pengajuan");
      }

      alert("Pengajuan cuti berhasil dikirim!");
      router.push("/dashboard/cuti");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
      <ProtectedLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Breadcrumb & Back */}
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/cuti" 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Buat Pengajuan Cuti Baru</h1>
            <p className="text-gray-600 text-sm">Lengkapi formulir di bawah ini untuk mengajukan cuti.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informasi Cuti */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <Calendar size={18} className="text-blue-600" />
              <h2 className="font-semibold text-gray-800">Detail Pengajuan</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Jenis Cuti</label>
                <select 
                  name="jenisCuti"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={formData.jenisCuti}
                  onChange={handleChange}
                >
                  <option value="">Pilih Jenis Cuti</option>
                  <option value="TAHUNAN">Cuti Tahunan</option>
                  <option value="BESAR">Cuti Besar</option>
                  <option value="SAKIT">Cuti Sakit</option>
                  <option value="MELAHIRKAN">Cuti Melahirkan</option>
                  <option value="ALASAN_PENTING">Cuti Karena Alasan Penting</option>
                  {/* <option value="LUAR_TANGGUNGAN_NEGARA">Cuti di Luar Tanggungan Negara</option> */}
                </select>
              </div>

              {/* Conditional Alert/Info based on Jenis Cuti */}
              <div className="md:col-span-2">
                {formData.jenisCuti === "SAKIT" && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex gap-2 items-start animate-fadeIn">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <p><strong>PENTING:</strong> Untuk cuti sakit, Anda <strong>WAJIB</strong> melampirkan surat keterangan sakit dari dokter pada bagian Dokumen Pendukung di bawah.</p>
                  </div>
                )}
                {formData.jenisCuti === "ALASAN_PENTING" && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 flex gap-2 items-start animate-fadeIn">
                    <FileText size={16} className="shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold mb-1">Kategori Cuti Alasan Penting:</p>
                      <ul className="list-disc ml-4 space-y-0.5">
                        <li>Ibu, bapak, isteri/suami, anak, adik, kakak, mertua atau menantu sakit keras atau meninggal dunia</li>
                        <li>Salah seorang anggota keluarga meninggal dunia dan menurut ketentuan hukum yang berlaku PNS yang bersangkutan harus mengurus hak-hak dari anggota keluarganya yang meninggal dunia</li>
                        <li>Melangsungkan perkawinan</li>
                      </ul>
                    </div>
                  </div>
                )}
                {formData.jenisCuti === "TAHUNAN" && (
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-xs text-indigo-800 flex gap-2 items-start animate-fadeIn">
                    <Calendar size={16} className="shrink-0 mt-0.5" />
                    <div>
                      <p><strong>Ketentuan:</strong> PNS yang telah bekerja paling kurang <strong>1 (satu) tahun</strong> secara terus menerus berhak atas cuti tahunan.</p>
                      <p className="mt-1"><strong>Pengecualian (tetap berhak meskipun belum 1 tahun):</strong> Orang tua/mertua, suami/istri, anak, atau saudara kandung sakit keras/meninggal dunia, atau melangsungkan perkawinan pertama.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Alasan Cuti</label>
                {formData.jenisCuti === "ALASAN_PENTING" ? (
                  <select 
                    name="alasan"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={formData.alasan}
                    onChange={handleChange}
                  >
                    <option value="">Pilih Alasan Spesifik</option>
                    <option value="Keluarga Sakit Keras/Meninggal Dunia">Keluarga (Ortu/Mertua/Pasangan/Anak/Saudara) Sakit Keras/Meninggal Dunia</option>
                    <option value="Mengurus Hak Keluarga Meninggal">Mengurus Hak Anggota Keluarga yang Meninggal Dunia</option>
                    <option value="Melangsungkan Perkawinan">Melangsungkan Perkawinan</option>
                    <option value="Lainnya">Lainnya (Tuliskan di detail)</option>
                  </select>
                ) : (
                  <input 
                    type="text"
                    name="alasan"
                    required
                    placeholder={formData.jenisCuti === "TAHUNAN" ? "Contoh: Melangsungkan perkawinan pertama / Keperluan keluarga" : "Masukkan alasan pengajuan cuti"}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={formData.alasan}
                    onChange={handleChange}
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tanggal Mulai</label>
                <input 
                  type="date"
                  name="tanggalMulai"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={formData.tanggalMulai}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tanggal Selesai</label>
                <input 
                  type="date"
                  name="tanggalSelesai"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={formData.tanggalSelesai}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Lama Cuti</label>
                  <input 
                    type="number"
                    name="jumlahHari"
                    required
                    placeholder="0"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={formData.jumlahHari}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Satuan</label>
                  <select 
                    name="durasiJenis"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={formData.durasiJenis}
                    onChange={handleChange}
                  >
                    <option selected value="HARI">Hari</option>
                    {/* <option value="BULAN">Bulan</option>
                    <option value="TAHUN">Tahun</option> */}
                  </select>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Alamat Selama Cuti</label>
                <textarea 
                  name="alamatSelama"
                  rows={3}
                  required
                  placeholder="Masukkan alamat lengkap Anda selama menjalankan cuti"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                  value={formData.alamatSelama}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Atasan 1 */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <User size={18} className="text-green-600" />
              <h2 className="font-semibold text-gray-800">Atasan Langsung (Atasan 1)</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Jabatan</label>
                <input 
                  type="text"
                  name="atasan1Jabatan"
                  required
                  placeholder="Jabatan Atasan"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={formData.atasan1Jabatan}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nama</label>
                <input 
                  type="text"
                  name="atasan1Nama"
                  required
                  placeholder="Nama Lengkap"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={formData.atasan1Nama}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">NIP</label>
                <input 
                  type="text"
                  name="atasan1Nip"
                  required
                  placeholder="NIP"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={formData.atasan1Nip}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Atasan 2 */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <User size={18} className="text-purple-600" />
              <h2 className="font-semibold text-gray-800">Atasan yang Berwenang (Atasan 2)</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Jabatan</label>
                <input 
                  type="text"
                  name="atasan2Jabatan"
                  required
                  placeholder="Jabatan Atasan"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={formData.atasan2Jabatan}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nama</label>
                <input 
                  type="text"
                  name="atasan2Nama"
                  required
                  placeholder="Nama Lengkap"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={formData.atasan2Nama}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">NIP</label>
                <input 
                  type="text"
                  name="atasan2Nip"
                  required
                  placeholder="NIP"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={formData.atasan2Nip}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* File Pendukung */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <Upload size={18} className="text-orange-600" />
              <h2 className="font-semibold text-gray-800">Dokumen Pendukung</h2>
            </div>
            <div className="p-6">
              <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                <Upload size={32} className={`mb-2 ${file ? 'text-blue-500' : 'text-gray-400'}`} />
                <p className="text-sm font-medium text-gray-900">
                  {file ? file.name : "Klik atau seret file ke sini"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {file ? `${(file.size / 1024).toFixed(1)} KB` : "PDF, JPG, atau PNG (Maks. 5MB)"}
                </p>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
              </label>
              {file && (
                <button 
                  type="button"
                  onClick={() => setFile(null)}
                  className="mt-2 text-xs text-red-500 hover:underline px-6 py-2 border"
                >
                  Hapus file
                </button>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link 
              href="/dashboard/cuti"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Batal
            </Link>
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Kirim Pengajuan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </ProtectedLayout>
  );
}