export function isAdmin(role: string): boolean {
    return role === "KEPALA_BADAN" || role === "ADMIN" || role === "KABAG_UMUM_KEPEGAWAIAN";
}
export function isKepala(role: string): boolean {
    return role === "KEPALA_BADAN";
}
export function isPegawai(role: string): boolean {
    return role === "PEGAWAI";
}
export function isKabid(role: string): boolean {
    return role === "KEPALA_BIDANG" || role === "SEKRETARIS_BADAN";
}

/**
 * Cek apakah role memiliki akses admin untuk notifikasi (lihat semua).
 * SEKRETARIS_BADAN setara admin untuk notifikasi.
 * KABAG_UMUM_KEPEGAWAIAN TIDAK termasuk — hanya melihat bawahan bidangnya.
 */
export function isNotifAdmin(role: string): boolean {
    return role === "ADMIN" || role === "KEPALA_BADAN" || role === "SEKRETARIS_BADAN";
}

/**
 * Membangun Prisma where clause untuk notifikasi berdasarkan role user.
 * - ADMIN, KEPALA_BADAN, SEKRETARIS_BADAN → semua notifikasi
 * - KEPALA_BIDANG, KABAG_UMUM_KEPEGAWAIAN → bawahan di bidang yang sama + milik sendiri
 * - PEGAWAI → hanya milik sendiri
 */
export function getNotificationWhereClause(
    role: string,
    pegawaiId: string,
    bidangId?: string | null
): Record<string, any> {
    // Admin-level: lihat semua
    if (isNotifAdmin(role)) {
        return {};
    }

    // Kepala Bidang & Kasubbag: lihat bawahan di bidang + milik sendiri
    if ((role === "KEPALA_BIDANG" || role === "KABAG_UMUM_KEPEGAWAIAN") && bidangId) {
        return {
            OR: [
                { pegawaiId },
                { pegawai: { bidangId } },
            ],
        };
    }

    // PEGAWAI default: hanya milik sendiri
    return { pegawaiId };
}