// src/types/index.ts
// Tipe-tipe utama yang digunakan di seluruh aplikasi

export type Role =
  | "ADMIN"
  | "KEPALA_BADAN"
  | "SEKRETARIS_BADAN"
  | "KABAG_UMUM_KEPEGAWAIAN"
  | "KEPALA_BIDANG"
  | "PEGAWAI";

export type Bidang =
  | "SEKRETARIAT"
  | "IDEOLOGI_WAWASAN_KARAKTER"
  | "POLITIK_ORMAS"
  | "KEWASPADAAN_NASIONAL";

export type StatusPengajuan =
  | "DRAFT"
  | "MENUNGGU"
  | "DIPROSES"
  | "DISETUJUI"
  | "DITOLAK";

export type JenisCuti =
  | "TAHUNAN"
  | "SAKIT"
  | "MELAHIRKAN"
  | "BESAR"
  | "ALASAN_PENTING"
  | "LUAR_TANGGUNGAN_NEGARA";

export const LABEL_ROLE: Record<Role, string> = {
  ADMIN: "Administrator",
  KEPALA_BADAN: "Kepala Badan",
  SEKRETARIS_BADAN: "Sekretaris Badan",
  KABAG_UMUM_KEPEGAWAIAN: "Kasubbag Umum & Kepegawaian",
  KEPALA_BIDANG: "Kepala Bidang",
  PEGAWAI: "Pegawai",
};

export const LABEL_BIDANG: Record<Bidang, string> = {
  SEKRETARIAT: "Sekretariat",
  IDEOLOGI_WAWASAN_KARAKTER: "Bid. Ideologi, Wawasan Kebangsaan & Karakter Bangsa",
  POLITIK_ORMAS: "Bid. Politik Dalam Negeri dan Ormas",
  KEWASPADAAN_NASIONAL: "Bid. Kewaspadaan Nasional",
};

export const LABEL_JENIS_CUTI: Record<JenisCuti, string> = {
  TAHUNAN: "Cuti Tahunan",
  SAKIT: "Cuti Sakit",
  MELAHIRKAN: "Cuti Melahirkan",
  BESAR: "Cuti Besar",
  ALASAN_PENTING: "Cuti Karena Alasan Penting",
  LUAR_TANGGUNGAN_NEGARA: "Cuti di Luar Tanggungan Negara",
};

export const LABEL_STATUS: Record<StatusPengajuan, string> = {
  DRAFT: "Draft",
  MENUNGGU: "Menunggu",
  DIPROSES: "Diproses",
  DISETUJUI: "Disetujui",
  DITOLAK: "Ditolak",
};

// Hirarki level akses (angka lebih kecil = level lebih tinggi)
export const ROLE_LEVEL: Record<Role, number> = {
  ADMIN: 0,
  KEPALA_BADAN: 1,
  SEKRETARIS_BADAN: 1,
  KABAG_UMUM_KEPEGAWAIAN: 2,
  KEPALA_BIDANG: 2,
  PEGAWAI: 3,
};

/**
 * Menentukan siapa yang perlu tanda tangan berdasarkan jabatan pemohon
 */
export function getTandaTangan(role: Role, bidang: Bidang): string[] {
  if (role === "PEGAWAI") {
    if (bidang === "SEKRETARIAT") {
      return ["Sekretaris Badan", "Kepala Badan"];
    }
    // Bidang lainnya
    return ["Kepala Bidang (sesuai bidang)", "Kepala Badan"];
  }
  if (role === "KEPALA_BIDANG" || role === "SEKRETARIS_BADAN") {
    return ["Kepala Badan", "Sekretaris Daerah"];
  }
  if (role === "KABAG_UMUM_KEPEGAWAIAN") {
    return ["Sekretaris Badan", "Kepala Badan"];
  }
  return ["Kepala Badan"];
}
