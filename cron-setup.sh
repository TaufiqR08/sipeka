#!/bin/bash
# ============================================================
# cron-setup.sh
# Script untuk setup Linux Crontab di Server
# ============================================================
#
# CARA PAKAI:
#   1. Upload file ini ke server
#   2. Jalankan: chmod +x cron-setup.sh
#   3. Jalankan: ./cron-setup.sh
#
# ATAU setup manual dengan: crontab -e
# lalu paste jadwal di bawah.
#
# ============================================================

# --- PENJELASAN ---
# Variabel ini bisa diubah sesuai kebutuhan server.
# BASE_URL = alamat di mana Next.js berjalan di server
# CRON_SECRET = token rahasia (HARUS SAMA dengan yang di .env)
# LOG_DIR = folder untuk menyimpan log cron

BASE_URL="http://localhost:3000"
CRON_SECRET="sipeka-cron-secret-2024"
LOG_DIR="/var/log/sipeka-cron"

# ============================================================
# Buat folder log jika belum ada
# ============================================================
# --- PENJELASAN ---
# mkdir = buat folder baru
# -p = jangan error jika folder sudah ada (parent directories juga dibuat)

mkdir -p $LOG_DIR

echo ""
echo "============================================"
echo "  SIPEKA - Cron Job Setup"
echo "============================================"
echo ""

# ============================================================
# Tampilkan jadwal crontab yang akan di-install
# ============================================================
# --- PENJELASAN FORMAT CRONTAB ---
#
# Format: menit jam hari_bulan bulan hari_minggu perintah
#
#  ┌───────── menit (0-59)
#  │ ┌─────── jam (0-23)
#  │ │ ┌───── hari dalam bulan (1-31)
#  │ │ │ ┌─── bulan (1-12)
#  │ │ │ │ ┌─ hari dalam minggu (0-7, 0 dan 7 = Minggu)
#  │ │ │ │ │
#  * * * * *  perintah
#
# Contoh:
#   */5 * * * *   = setiap 5 menit
#   0 7 * * *     = setiap hari jam 07:00
#   0 7 * * 1-5   = setiap hari kerja (Senin-Jumat) jam 07:00
#   0 */2 * * *   = setiap 2 jam
#
# --- PENJELASAN CURL ---
# curl = perintah Linux untuk request HTTP (seperti browser tapi via terminal)
#   -s           = silent mode (tidak tampilkan progress bar)
#   -o /dev/null = buang output (tidak perlu lihat response body)
#   -w "%{http_code}" = hanya tampilkan HTTP status code (200, 401, 500, dll)
#   -H "..."     = tambahkan header ke request
#
# >> $LOG_DIR/... = simpan output ke file log (>> = append, tidak overwrite)
# 2>&1           = gabungkan error output ke file log yang sama
# ============================================================

echo "Jadwal Cron yang akan di-setup:"
echo ""
echo "  1. Kirim Notifikasi WA    → Setiap 5 menit"
echo "  2. Cek KGB/KP Kesbangpol  → Setiap hari jam 07:00"
echo "  3. Cek KGB/KP BRIDA       → Setiap hari jam 07:00"
echo ""

# ============================================================
# Buat crontab entries
# ============================================================
# --- PENJELASAN ---
# Kita tulis jadwal cron ke file temporary dulu, baru install.
# Ini agar tidak menghapus cron job lain yang sudah ada.
#
# crontab -l       = tampilkan cron job yang sudah ada
# 2>/dev/null      = abaikan error jika belum ada cron
# grep -v "sipeka" = hapus entry sipeka lama (agar tidak duplikat)

# Simpan cron yang sudah ada (tanpa entry sipeka lama)
crontab -l 2>/dev/null | grep -v "sipeka" > /tmp/cron_temp

# --- PENJELASAN ---
# cat >> /tmp/cron_temp << 'EOF'
# Ini disebut "heredoc" — cara menulis multi-line text ke file.
# Semua teks antara << 'EOF' dan EOF akan ditulis ke file.

cat >> /tmp/cron_temp << EOF

# ============================================================
# SIPEKA Cron Jobs (jangan edit manual, gunakan cron-setup.sh)
# ============================================================

# [JOB 1] Kirim notifikasi WA yang tertunda — setiap 5 menit
# Kenapa 5 menit? Cukup responsif untuk notifikasi, tapi tidak terlalu sering
# sehingga tidak membebani server.
*/5 * * * * curl -s -o /dev/null -w "\%{http_code}" -H "Authorization: Bearer ${CRON_SECRET}" "${BASE_URL}/api/cron?job=kirim-notif" >> ${LOG_DIR}/kirim-notif.log 2>&1 && echo " [sipeka] \$(date '+\%Y-\%m-\%d \%H:\%M') kirim-notif" >> ${LOG_DIR}/kirim-notif.log

# [JOB 2] Cek deadline KGB/KP Kesbangpol — setiap hari jam 07:00
# Jam 7 pagi dipilih agar pegawai bisa melihat notifikasi saat mulai kerja.
0 7 * * * curl -s -o /dev/null -w "\%{http_code}" -H "Authorization: Bearer ${CRON_SECRET}" "${BASE_URL}/api/cron?job=cek-waktu-kesbangpol" >> ${LOG_DIR}/cek-waktu.log 2>&1 && echo " [sipeka] \$(date '+\%Y-\%m-\%d \%H:\%M') cek-kesbangpol" >> ${LOG_DIR}/cek-waktu.log

# [JOB 3] Cek deadline KGB/KP BRIDA — setiap hari jam 07:00
0 7 * * * curl -s -o /dev/null -w "\%{http_code}" -H "Authorization: Bearer ${CRON_SECRET}" "${BASE_URL}/api/cron?job=cek-waktu-brida" >> ${LOG_DIR}/cek-waktu.log 2>&1 && echo " [sipeka] \$(date '+\%Y-\%m-\%d \%H:\%M') cek-brida" >> ${LOG_DIR}/cek-waktu.log

# ============================================================
EOF

# --- PENJELASAN ---
# crontab /tmp/cron_temp = install cron job dari file
# rm /tmp/cron_temp      = hapus file temporary

crontab /tmp/cron_temp
rm /tmp/cron_temp

echo "✅ Cron jobs berhasil di-install!"
echo ""
echo "============================================"
echo "  Verifikasi"
echo "============================================"
echo ""
echo "Cron jobs yang aktif:"
crontab -l | grep -A1 "sipeka"
echo ""
echo "============================================"
echo "  Cara Cek & Troubleshoot"
echo "============================================"
echo ""
echo "  # Lihat semua cron job:"
echo "  crontab -l"
echo ""
echo "  # Lihat log kirim notifikasi:"
echo "  tail -f ${LOG_DIR}/kirim-notif.log"
echo ""
echo "  # Lihat log cek waktu:"
echo "  tail -f ${LOG_DIR}/cek-waktu.log"
echo ""
echo "  # Test manual (jalankan job sekarang):"
echo "  curl -H \"Authorization: Bearer ${CRON_SECRET}\" \"${BASE_URL}/api/cron?job=kirim-notif\""
echo ""
echo "  # Jalankan SEMUA job sekaligus:"
echo "  curl -H \"Authorization: Bearer ${CRON_SECRET}\" \"${BASE_URL}/api/cron?job=all\""
echo ""
echo "  # Lihat job yang tersedia:"
echo "  curl -H \"Authorization: Bearer ${CRON_SECRET}\" \"${BASE_URL}/api/cron\""
echo ""
echo "  # Hapus semua cron sipeka:"
echo "  crontab -l | grep -v sipeka | crontab -"
echo ""

echo "============================================"
echo "  PENTING!"
echo "============================================"
echo ""
echo "  Jangan lupa tambahkan ke .env.production:"
echo "  CRON_SECRET=\"${CRON_SECRET}\""
echo ""
echo "  Ganti token ini dengan yang lebih aman untuk production!"
echo ""
