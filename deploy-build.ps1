# ============================================================
# deploy-build.ps1
# Script otomatis untuk Build & Siapkan Deploy Next.js Standalone
# ============================================================
# 
# CARA PAKAI:
#   Buka terminal PowerShell di folder project, lalu jalankan:
#   .\deploy-build.ps1
#
# APA YANG DILAKUKAN SCRIPT INI:
#   1. Menjalankan "next build" untuk compile project
#   2. Meng-copy folder ".next/static" ke dalam ".next/standalone/.next/static"
#      (berisi CSS, JavaScript chunks, fonts — WAJIB agar tampilan muncul)
#   3. Meng-copy folder "public" ke dalam ".next/standalone/public"
#      (berisi gambar, favicon, file statis lainnya)
#   4. Meng-copy file ".env.production" ke dalam ".next/standalone/"
#      (berisi konfigurasi database, URL, dll untuk production)
#
# HASIL AKHIR:
#   Folder ".next/standalone" siap di-upload ke server.
#   Di server cukup jalankan: node server.js
# ============================================================

# --- PENJELASAN: Write-Host adalah perintah untuk menampilkan teks di terminal ---
# --- Parameter -ForegroundColor mengubah warna teks agar mudah dibaca ---

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  SIPEKA - Build & Deploy Preparation" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# ============================================================
# STEP 1: Jalankan "next build"
# ============================================================
# --- PENJELASAN ---
# "npm run build" akan menjalankan script "build" di package.json
# yaitu "next build", yang akan:
#   - Compile semua file TypeScript/JSX menjadi JavaScript
#   - Optimize CSS dan JavaScript (minify, tree-shaking)
#   - Generate halaman statis (SSG) jika ada
#   - Menghasilkan folder .next/standalone karena config output:'standalone'

Write-Host "[1/4] Menjalankan 'next build'..." -ForegroundColor Yellow
Write-Host "      (Ini akan compile project menjadi versi production)" -ForegroundColor Gray

npm run build

# --- PENJELASAN ---
# $LASTEXITCODE adalah variabel otomatis PowerShell yang menyimpan
# exit code dari perintah terakhir yang dijalankan.
# Exit code 0 = sukses, selain 0 = gagal.
# -ne artinya "not equal" (tidak sama dengan)

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[ERROR] Build gagal! Perbaiki error di atas dulu." -ForegroundColor Red
    # --- "exit 1" menghentikan script dan memberikan kode error 1 ---
    exit 1
}

Write-Host "[1/4] Build berhasil!" -ForegroundColor Green
Write-Host ""

# ============================================================
# STEP 2: Copy .next/static → .next/standalone/.next/static
# ============================================================
# --- PENJELASAN ---
# Folder .next/static berisi semua file CSS dan JavaScript yang
# sudah di-compile. TANPA folder ini, browser tidak bisa memuat
# stylesheet dan script → tampilan BLANK / tidak ada styling.
#
# Kenapa Next.js tidak otomatis copy?
# Karena mode "standalone" dirancang untuk deployment yang fleksibel.
# Next.js mengasumsikan kamu mungkin ingin serve file statis dari
# CDN terpisah (seperti CloudFront, Vercel Edge), jadi mereka
# memisahkan file statis dari server code.

Write-Host "[2/4] Meng-copy .next/static..." -ForegroundColor Yellow
Write-Host "      (File CSS, JS, dan font yang dibutuhkan browser)" -ForegroundColor Gray

# --- PENJELASAN ---
# $PSScriptRoot adalah variabel otomatis yang berisi path folder
# tempat script ini berada. Jadi script ini bisa dipanggil dari mana saja.
# 
# Join-Path menggabungkan path dengan cara yang aman (otomatis handle
# separator "/" atau "\" tergantung OS).

$projectRoot = $PSScriptRoot
$standaloneDir = Join-Path $projectRoot ".next\standalone"
$sourceStatic = Join-Path $projectRoot ".next\static"
$destStatic = Join-Path $standaloneDir ".next\static"

# --- PENJELASAN ---
# Test-Path mengecek apakah folder/file ada di disk.
# Ini penting untuk menghindari error jika folder belum ada.

if (Test-Path $sourceStatic) {
    # --- PENJELASAN ---
    # Jika folder tujuan sudah ada dari build sebelumnya, hapus dulu
    # agar tidak ada file lama yang tertinggal (bisa bikin bug).
    # Remove-Item -Recurse = hapus folder beserta isinya
    # -Force = jangan tanya konfirmasi, langsung hapus
    
    if (Test-Path $destStatic) {
        Remove-Item -Recurse -Force $destStatic
    }
    
    # --- PENJELASAN ---
    # Copy-Item -Recurse = copy folder beserta SEMUA isinya (subfolder + file)
    # -Force = timpa file yang sudah ada tanpa tanya
    # Ini yang KRUSIAL — tanpa step ini, tampilan tidak akan muncul!
    
    Copy-Item -Recurse -Force $sourceStatic $destStatic
    Write-Host "[2/4] Static files berhasil di-copy!" -ForegroundColor Green
} else {
    Write-Host "[2/4] WARNING: Folder .next/static tidak ditemukan!" -ForegroundColor Red
    Write-Host "      Pastikan build berhasil di step sebelumnya." -ForegroundColor Red
}

Write-Host ""

# ============================================================
# STEP 3: Copy public → .next/standalone/public
# ============================================================
# --- PENJELASAN ---
# Folder "public" berisi file statis yang bisa diakses langsung
# lewat URL, contoh:
#   public/logo.png → bisa diakses di https://domain.com/logo.png
#   public/uploads/  → tempat file upload user
# 
# Tanpa folder ini, semua gambar dan file statis akan 404 (not found).

Write-Host "[3/4] Meng-copy folder public..." -ForegroundColor Yellow
Write-Host "      (Gambar, favicon, file upload, dll)" -ForegroundColor Gray

$sourcePublic = Join-Path $projectRoot "public"
$destPublic = Join-Path $standaloneDir "public"

if (Test-Path $sourcePublic) {
    if (Test-Path $destPublic) {
        Remove-Item -Recurse -Force $destPublic
    }
    Copy-Item -Recurse -Force $sourcePublic $destPublic
    Write-Host "[3/4] Public folder berhasil di-copy!" -ForegroundColor Green
} else {
    Write-Host "[3/4] WARNING: Folder public tidak ditemukan!" -ForegroundColor Red
}

Write-Host ""

# ============================================================
# STEP 4: Copy .env.production → .next/standalone/
# ============================================================
# --- PENJELASAN ---
# File .env.production berisi konfigurasi yang dibutuhkan di server:
#   - DATABASE_URL → koneksi ke database MySQL
#   - NEXTAUTH_URL → URL untuk authentication
#   - NEXTAUTH_SECRET → kunci rahasia untuk enkripsi session
#   - dll
#
# Tanpa file ini, aplikasi akan crash karena tidak tahu
# cara konek ke database.

Write-Host "[4/4] Meng-copy .env.production..." -ForegroundColor Yellow
Write-Host "      (Konfigurasi database, auth, dll untuk production)" -ForegroundColor Gray

$sourceEnv = Join-Path $projectRoot ".env.production"
$destEnv = Join-Path $standaloneDir ".env.production"

if (Test-Path $sourceEnv) {
    Copy-Item -Force $sourceEnv $destEnv
    Write-Host "[4/4] .env.production berhasil di-copy!" -ForegroundColor Green
} else {
    Write-Host "[4/4] INFO: File .env.production tidak ditemukan, skip." -ForegroundColor Yellow
    Write-Host "      (Pastikan env sudah dikonfigurasi di server)" -ForegroundColor Gray
}

Write-Host ""

# ============================================================
# SELESAI — Tampilkan ringkasan
# ============================================================

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  BUILD & PREPARATION SELESAI!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Folder siap deploy:" -ForegroundColor White
Write-Host "  $standaloneDir" -ForegroundColor Yellow
Write-Host ""
Write-Host "LANGKAH SELANJUTNYA:" -ForegroundColor White
Write-Host "  1. Upload folder '.next/standalone' ke server" -ForegroundColor Gray
Write-Host "  2. Di server, masuk ke folder tersebut" -ForegroundColor Gray
Write-Host "  3. Jalankan: node server.js" -ForegroundColor Gray
Write-Host "  4. Aplikasi berjalan di port 3000 (default)" -ForegroundColor Gray
Write-Host ""
Write-Host "TIPS:" -ForegroundColor White
Write-Host "  - Gunakan PM2 agar app tetap jalan di background:" -ForegroundColor Gray
Write-Host "    pm2 start server.js --name sipeka" -ForegroundColor Yellow
Write-Host "  - Untuk ganti port:" -ForegroundColor Gray
Write-Host "    PORT=3002 node server.js" -ForegroundColor Yellow
Write-Host ""
