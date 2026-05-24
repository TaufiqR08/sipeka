# 🏛️ SIMPEG Kesbangpol Sumbawa Barat

Sistem Informasi Kepegawaian Digital — Platform pengajuan **Cuti**, **Kenaikan Gaji Berkala (KGB)**, dan **Kenaikan Pangkat** untuk Dinas Kesatuan Bangsa dan Politik Kabupaten Sumbawa Barat.

**Stack:** Next.js 14 (App Router) • TypeScript • Prisma ORM • MySQL • NextAuth.js • Tailwind CSS

---

## 📁 Struktur Proyek

```
simpeg-kesbangpol/
├── prisma/
│   ├── schema.prisma          # Skema database (MySQL)
│   └── seed.ts                # Data awal (user & pegawai)
├── src/
│   ├── app/
│   │   ├── auth/login/        # Halaman login
│   │   ├── dashboard/         # Dashboard utama
│   │   │   ├── cuti/          # Pengajuan cuti
│   │   │   ├── kgb/           # Kenaikan Gaji Berkala
│   │   │   ├── pangkat/       # Kenaikan Pangkat
│   │   │   └── pegawai/       # Data Pegawai
│   │   └── api/
│   │       ├── auth/          # NextAuth handler
│   │       ├── cuti/          # CRUD cuti
│   │       ├── kgb/           # CRUD KGB
│   │       ├── pangkat/       # CRUD kenaikan pangkat
│   │       └── pegawai/       # CRUD data pegawai
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx    # Sidebar navigasi
│   │   │   └── Topbar.tsx     # Header atas
│   │   ├── forms/
│   │   │   ├── FormCuti.tsx   # Form pengajuan cuti
│   │   │   ├── FormKGB.tsx    # Form KGB
│   │   │   └── FormPangkat.tsx # Form kenaikan pangkat
│   │   └── ui/                # Komponen kecil (Badge, Button, dll)
│   ├── lib/
│   │   ├── prisma.ts          # Singleton Prisma Client
│   │   └── auth.ts            # Konfigurasi NextAuth
│   ├── types/
│   │   └── index.ts           # Type definitions & helpers
│   └── hooks/                 # Custom React hooks
├── .env.example               # Template variabel environment
├── package.json
└── README.md
```

---

## 🚀 Cara Menjalankan

### 1. Clone & Install

```bash
git clone <repo-url>
cd simpeg-kesbangpol
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env.local
# Edit .env.local sesuai konfigurasi MySQL Anda
```

Isi `DATABASE_URL` dengan koneksi MySQL Anda:
```
DATABASE_URL="mysql://root:password@localhost:3306/simpeg_kesbangpol"
NEXTAUTH_SECRET="isi-dengan-string-acak-panjang"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Setup Database

```bash
# Buat database di MySQL terlebih dahulu
mysql -u root -p -e "CREATE DATABASE simpeg_kesbangpol;"

# Jalankan migrasi
npx prisma migrate dev --name init

# (Opsional) Isi data awal
npm run db:seed

# Lihat data lewat GUI
npm run db:studio
```

### 4. Jalankan Aplikasi

```bash
npm run dev
# Buka http://localhost:3000
```

---

## 👥 Level Akses Pengguna

| Role | Akses Data Pegawai | Akses Pengajuan |
|------|-------------------|-----------------|
| **Admin** | Semua pegawai | Semua pengajuan |
| **Kepala Badan** | Semua pegawai | Semua pengajuan |
| **Sekretaris Badan** | Semua pegawai | Semua pengajuan |
| **Kabag Umum & Kepeg.** | Pegawai di bawahnya | Pengajuan non-pimpinan |
| **Kepala Bidang** | Pegawai bidangnya | Pengajuan bidangnya |
| **Pegawai** | Profil sendiri | Pengajuan sendiri |

---

## ✍️ Logika Tanda Tangan Cuti

| Pemohon | Tanda Tangan Yang Dibutuhkan |
|---------|------------------------------|
| Pegawai (Sekretariat) | Sekretaris Badan → Kepala Badan |
| Pegawai (Bidang lain) | Kepala Bidang ybs → Kepala Badan |
| Kepala Bidang | Kepala Badan → Sekretaris Daerah |
| Sekretaris Badan | Kepala Badan → Sekretaris Daerah |

---

## 📋 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET/POST | `/api/cuti` | Daftar & buat pengajuan cuti |
| GET/PUT | `/api/cuti/[id]` | Detail & update status cuti |
| GET/POST | `/api/kgb` | Daftar & buat pengajuan KGB |
| GET/POST | `/api/pangkat` | Daftar & buat pengajuan pangkat |
| GET/POST | `/api/pegawai` | Daftar & tambah pegawai |
| GET/PUT | `/api/pegawai/[id]` | Detail & edit pegawai |
| POST | `/api/auth/[...nextauth]` | Login/logout handler |

---

## 🖨️ Cetak PDF

Fitur cetak PDF menggunakan library `jspdf` + `jspdf-autotable`.  
Format surat sesuai template resmi yang dapat dikustomisasi di `src/lib/pdf/`.

---

## 🔧 Development Notes

- **Next.js App Router** digunakan untuk semua routing dan API
- **Server Components** untuk halaman, **Client Components** hanya untuk form & interaktivitas
- **Prisma** sebagai ORM — jalankan `npx prisma generate` setelah perubahan schema
- File upload disimpan di `public/uploads/` (dapat diganti ke cloud storage)
