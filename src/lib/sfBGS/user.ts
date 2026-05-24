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