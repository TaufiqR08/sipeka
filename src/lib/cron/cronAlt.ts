// ============================================================
// cronAlt.ts — Alternatif Cron Job (TANPA node-cron)
// ============================================================
//
// FILE INI ADALAH PENGGANTI notifCron.ts
// Bedanya:
//   - notifCron.ts → pakai library "node-cron" yang berjalan DI DALAM Node.js
//   - cronAlt.ts   → fungsi biasa yang dipanggil dari LUAR (via API endpoint)
//
// KENAPA LEBIH BAIK?
//   1. Tidak membebani proses Next.js (cron jalan terpisah di Linux)
//   2. Tidak duplikat kalau server di-scale (crontab hanya di 1 mesin)
//   3. Mudah di-monitor (cek log crontab di Linux)
//   4. Next.js restart? Cron tetap jalan (karena dikelola Linux, bukan Node.js)
//
// CARA KERJA:
//   Linux crontab → curl http://localhost:3000/api/cron?job=xxx → fungsi di file ini
//
// ============================================================

import { prisma } from "@/lib/prisma";
import { getRemainingDays, _notif } from "@/lib/sfBGS";
import { fitur } from "@prisma/client";

// ============================================================
// TIPE DATA (Type Definitions)
// ============================================================

// --- PENJELASAN ---
// Interface adalah "cetakan" yang mendefinisikan bentuk data.
// Mirip seperti template form — menentukan field apa saja yang harus diisi.

/** Hasil return dari setiap job, untuk logging & monitoring */
interface JobResult {
  job: string;        // nama job yang dijalankan
  success: boolean;   // apakah berhasil?
  processed: number;  // berapa data yang diproses
  errors: number;     // berapa yang error
  message: string;    // pesan ringkasan
  duration: number;   // berapa lama (ms)
}

/** Data untuk kirim WhatsApp */
interface SendPayload {
  target: string;     // nomor tujuan
  message: string;    // isi pesan
}

// ============================================================
// FUNGSI HELPER (Pembantu)
// ============================================================

/**
 * Kirim pesan WhatsApp via Fonnte API
 *
 * --- PENJELASAN ---
 * FormData = format pengiriman data seperti form HTML.
 * fetch() = fungsi bawaan JavaScript untuk request HTTP (mirip curl).
 * async/await = cara menulis kode asynchronous (menunggu response)
 *   agar kode tetap mudah dibaca seperti kode synchronous biasa.
 *
 * @param payload - berisi target (nomor HP) dan message (isi pesan)
 * @returns true jika berhasil, false jika gagal
 */
async function sendWhatsApp(payload: SendPayload): Promise<boolean> {
  try {
    // --- PENJELASAN ---
    // FormData menampung data yang akan dikirim ke API.
    // Ini sama seperti mengisi form di website, tapi dilakukan via kode.
    const formData = new FormData();
    formData.append("target", `0${payload.target}`);   // tambah "0" di depan nomor
    formData.append("message", payload.message);
    formData.append("countryCode", "62");               // kode negara Indonesia

    // --- PENJELASAN ---
    // fetch() mengirim HTTP request ke server Fonnte (penyedia WA Gateway).
    // method: "POST" = kita mengirim data (bukan mengambil data).
    // headers.Authorization = token API agar Fonnte tahu ini request dari kita.
    const resp = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: process.env.WHATSAPP_TOKEN || "",
      },
      body: formData,
    });

    // --- PENJELASAN ---
    // resp.json() mengubah response dari Fonnte menjadi object JavaScript.
    // .catch(() => ({})) = kalau gagal parse JSON, kembalikan object kosong
    //   agar tidak crash.
    const result = await resp.json().catch(() => ({}));
    console.log("[Fonnte]", resp.status, result);

    // Cek apakah Fonnte menolak request kita
    if (!resp.ok || result?.status === false) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("[sendWhatsApp] Error:", error);
    return false;
  }
}

/**
 * Cek apakah jumlah hari masuk kategori "perlu dinotifikasi"
 *
 * --- PENJELASAN ---
 * Fungsi ini menentukan di hari keberapa notifikasi warning dikirim.
 * Contoh: jika KGB tinggal 30 hari lagi → kirim warning.
 * Angka-angka ini adalah milestone pengingat.
 *
 * @param hari - sisa hari sebelum deadline
 * @returns true jika hari ini adalah hari pengingat
 */
function waktuNotif(hari: number): boolean {
  return [90, 60, 30, 21, 14, 7].includes(hari);
}

// ============================================================
// JOB 1: Kirim Notifikasi WhatsApp yang Tertunda
// ============================================================
// Pengganti: startNotifCron() di notifCron.ts
// Jadwal lama: setiap 1 menit (terlalu sering!)
// Jadwal baru: setiap 5 menit (lebih hemat, cukup responsif)
// ============================================================

/**
 * --- PENJELASAN LENGKAP ---
 *
 * Fungsi ini mengambil notifikasi yang belum terkirim dari database,
 * lalu mengirimnya satu per satu via WhatsApp.
 *
 * Alur:
 * 1. Query database → cari notification yang send = false
 * 2. Loop setiap notifikasi
 * 3. Kirim via WhatsApp API (Fonnte)
 * 4. Kalau berhasil → update database (send = true)
 * 5. Return hasil ringkasan
 *
 * PERBEDAAN dengan versi lama:
 * - Versi lama: selalu jalan tiap 1 menit meskipun tidak ada notif
 * - Versi baru: hanya jalan saat dipanggil oleh crontab tiap 5 menit
 * - Versi baru: ada return value untuk monitoring (bisa dicek berhasil/gagal)
 */
export async function jobKirimNotif(): Promise<JobResult> {
  const startTime = Date.now();
  //    ^^^^^^^^^ Date.now() mengembalikan waktu saat ini dalam milidetik
  //              Digunakan untuk menghitung berapa lama job berjalan

  let processed = 0;  // counter notifikasi yang diproses
  let errors = 0;     // counter yang gagal

  try {
    // --- PENJELASAN ---
    // prisma.notification.findMany() = query ke tabel "notification"
    // where: { send: false } = filter hanya yang belum terkirim
    // include: { pegawai: true } = JOIN dengan tabel pegawai (untuk ambil noTelp)
    // take: 10 = ambil maksimal 10 saja per batch (agar tidak overload)
    const pendingNotifs = await prisma.notification.findMany({
      where: { send: false },
      include: { pegawai: true },
      take: 10,
    });

    // --- PENJELASAN ---
    // Jika tidak ada notifikasi yang perlu dikirim, langsung return
    // Ini lebih efisien daripada versi lama yang tetap jalan meskipun kosong
    if (pendingNotifs.length === 0) {
      return {
        job: "kirim-notif",
        success: true,
        processed: 0,
        errors: 0,
        message: "Tidak ada notifikasi tertunda",
        duration: Date.now() - startTime,
      };
    }

    // --- PENJELASAN ---
    // for...of = loop melalui setiap item dalam array.
    // Berbeda dengan forEach, for...of mendukung async/await
    // sehingga kita bisa menunggu setiap kirim WA selesai sebelum lanjut.
    for (const notif of pendingNotifs) {
      try {
        // Tentukan nomor tujuan berdasarkan sumber notifikasi
        // Jika dari BRIDA → pakai field "info" (nomor dari tabel pegawaii)
        // Jika bukan BRIDA → pakai noTelp dari relasi pegawai
        const noTelp =
          notif.sumber === "BRIDA"
            ? notif.info ?? ""
            : notif.pegawai?.noTelp ?? "";

        // Skip jika tidak ada nomor telepon
        if (!noTelp) {
          errors++;
          continue;  // lanjut ke notifikasi berikutnya
        }

        // Kirim WA
        const sent = await sendWhatsApp({
          target: noTelp,
          message: `${notif.title}\n${notif.message}`,
        });

        if (sent) {
          // --- PENJELASAN ---
          // Jika berhasil kirim, update database agar tidak dikirim ulang.
          // prisma.notification.update() = UPDATE ... WHERE id = ...
          await prisma.notification.update({
            where: { id: notif.id },
            data: { send: true },
          });
          processed++;
        } else {
          errors++;
        }
      } catch (err) {
        console.error("[jobKirimNotif] Error per-notif:", err);
        errors++;
      }
    }

    return {
      job: "kirim-notif",
      success: true,
      processed,
      errors,
      message: `Terkirim: ${processed}, Gagal: ${errors}`,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    console.error("[jobKirimNotif] Error:", error);
    return {
      job: "kirim-notif",
      success: false,
      processed,
      errors,
      message: `Error: ${error}`,
      duration: Date.now() - startTime,
    };
  }
}

// ============================================================
// JOB 2: Cek & Buat Notifikasi KGB/KP Pegawai (Kesbangpol)
// ============================================================
// Pengganti: noteNotifWaktu() di notifCron.ts
// Jadwal: setiap hari jam 7 pagi (sama seperti sebelumnya)
// ============================================================

/**
 * --- PENJELASAN LENGKAP ---
 *
 * Fungsi ini mengecek SEMUA pegawai Kesbangpol, apakah ada yang
 * mendekati deadline KGB atau Kenaikan Pangkat.
 *
 * Alur:
 * 1. Ambil semua pegawai dari database
 * 2. Untuk setiap pegawai, hitung sisa hari:
 *    - KGB: tglMasaKerja + 2 tahun = deadline
 *    - KP: tmtGolongan + 4 tahun = deadline
 * 3. Jika sisa hari = 90, 60, 30, 21, 14, atau 7 → buat notifikasi
 * 4. Notifikasi disimpan ke database (belum dikirim via WA)
 * 5. Nanti JOB 1 yang akan mengirimnya via WA
 *
 * Jadi alurnya:
 * JOB 2 → buat notifikasi di DB → JOB 1 → kirim via WA
 */
let startedKesbangpol= 2;
export async function jobCekWaktuKesbangpol(): Promise<JobResult> {
  const startTime = Date.now();
  let processed = 0;
  let errors = 0;

  try {
    // --- PENJELASAN ---
    // Ambil SEMUA pegawai dari tabel "pegawai" (Kesbangpol)
    // Catatan: untuk skala besar, sebaiknya pakai pagination/cursor
    // tapi untuk pegawai Kesbangpol (<100 orang), ini masih aman.
    const pegawai = await prisma.pegawai.findMany();

    for (const v of pegawai) {
      try {
        // --- PENJELASAN ---
        // getRemainingDays(tanggal, tahun) menghitung:
        //   1. tanggal + tahun = tanggal target (deadline)
        //   2. tanggal target - hari ini = sisa hari
        //
        // Contoh KGB:
        //   tglMasaKerja = 2023-01-01, yearsToAdd = 2
        //   target = 2025-01-01
        //   sisa hari = 2025-01-01 - hari ini
        //
        // Contoh KP:
        //   tmtGolongan = 2021-06-15, yearsToAdd = 4
        //   target = 2025-06-15
        //   sisa hari = 2025-06-15 - hari ini

        const kgb = getRemainingDays(v.tglMasaKerja ?? new Date(), 2);
        const kp = getRemainingDays(v.tmtGolongan ?? new Date(), 4);

        // --- PENJELASAN ---
        // waktuNotif() mengecek apakah sisa hari termasuk milestone:
        // [90, 60, 30, 21, 14, 7]
        // Jika ya → buat notifikasi warning
        console.log(waktuNotif(kgb.remainingDays) || startedKesbangpol >0);
        
        if (waktuNotif(kgb.remainingDays) || startedKesbangpol >0) {
          console.log("Bagus H");
          
          if(startedKesbangpol >0){  
            await _notif({
              title: `Warning !!!`,
              message: `Batas pengajuan pengajuan Gaji Berkala tersisa ${kp.remainingDays} hari lagi.`,
              pegawaiId: "848d645b-4f48-11f1-aa91-2c56dcb03c3b",
              sumber: fitur.BRIDA as any,
              info: startedKesbangpol >0 ?  "81339740052" : v.noTelp ?? "",
            });
          }else{
            await _notif({
              title: `Warning !!!`,
              message: ` Batas pengajuan Kenaikan Gaji Berkala tersisa ${kgb.remainingDays} hari lagi.`,
              pegawaiId: v.id,
              sumber: "KGB",
              info: "WARNING",
            });
          } 
          
          processed++;
          startedKesbangpol--;
        }

        if (waktuNotif(kp.remainingDays) || startedKesbangpol >0) {
          if(startedKesbangpol >0){ 
            await _notif({
              title: `Warning !!!`,
              message: `Batas pengajuan pengajuan Kenaikan Pangkat tersisa ${kp.remainingDays} hari lagi.`,
              pegawaiId: "848d645b-4f48-11f1-aa91-2c56dcb03c3b",
              sumber: fitur.BRIDA as any,
              info: startedKesbangpol >0 ?  "81339740052" : v.noTelp ?? "",
            });
          }else{
            await _notif({
              title: `Warning !!!`,
              message: `Batas pengajuan pengajuan Kenaikan Pangkat tersisa ${kp.remainingDays} hari lagi.`,
              pegawaiId: v.id,
              sumber: "KP",
              info: "WARNING",
            });
          } 
          
          processed++;
          startedKesbangpol--;
        }
      } catch (err) {
        console.error("[jobCekWaktu] Error per-pegawai:", err);
        errors++;
      }
    }

    return {
      job: "cek-waktu-kesbangpol",
      success: true,
      processed,
      errors,
      message: `Notifikasi dibuat: ${processed}, Error: ${errors}`,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    console.error("[jobCekWaktuKesbangpol] Error:", error);
    return {
      job: "cek-waktu-kesbangpol",
      success: false,
      processed,
      errors,
      message: `Error: ${error}`,
      duration: Date.now() - startTime,
    };
  }
}

// ============================================================
// JOB 3: Cek & Buat Notifikasi KGB/KP Pegawai (BRIDA)
// ============================================================
// Pengganti: noteNotifWaktuBrida() di notifCron.ts
// Jadwal: setiap hari jam 7 pagi (sama seperti sebelumnya)
// ============================================================

/**
 * --- PENJELASAN LENGKAP ---
 *
 * Sama seperti JOB 2, tapi untuk data pegawai BRIDA.
 *
 * PERBEDAAN:
 * - JOB 2 pakai prisma.pegawai.findMany() → tabel "pegawai" (Kesbangpol)
 * - JOB 3 pakai prisma.$queryRaw → tabel "pegawaii" (BRIDA, beda tabel!)
 *
 * --- PENJELASAN $queryRaw ---
 * prisma.$queryRaw adalah cara menjalankan SQL mentah (raw SQL).
 * Biasanya kita pakai prisma.model.findMany() yang lebih aman,
 * tapi tabel "pegawaii" mungkin tidak ada di schema Prisma,
 * jadi harus pakai raw query.
 *
 * Sintaks: prisma.$queryRaw`SELECT * FROM pegawaii`
 * Backtick (`) digunakan untuk template literal yang aman dari SQL injection.
 */

// Type untuk hasil query raw dari tabel "pegawaii" (BRIDA)
interface PegawaiBridaRaw {
  tglMasaKerja: Date | null;
  tmtGolongan: Date | null;
  noTelp: string | null;
}
let startedBrida= 2;
export async function jobCekWaktuBrida(): Promise<JobResult> {
  const startTime = Date.now();
  let processed = 0;
  let errors = 0;

  try {
    // --- PENJELASAN ---
    // $queryRaw<T> menjalankan SQL mentah dan mengembalikan hasil
    // dengan tipe T. Di sini T = PegawaiBridaRaw[]
    // (array of PegawaiBridaRaw).
    const pegawai = await prisma.pegawaii.findMany();

    for (const v of pegawai) {
      try {
        const kgb = getRemainingDays(v.tglMasaKerja ?? new Date(), 2);
        const kp = getRemainingDays(v.tmtGolongan ?? new Date(), 4);

        if (waktuNotif(kgb.remainingDays) || startedBrida >0) {
          await _notif({
            title: `Warning !!!`,
            message: ` Batas pengajuan Kenaikan Gaji Berkala tersisa ${kgb.remainingDays} hari lagi.`,
            // --- PENJELASAN ---
            // pegawaiId di-hardcode karena notif BRIDA dikirim ke
            // satu akun admin yang bertanggung jawab atas semua pegawai BRIDA.
            pegawaiId: "848d645b-4f48-11f1-aa91-2c56dcb03c3b",
            sumber: fitur.BRIDA as any,
            info: startedBrida >0 ?  "85253636114" :v.noTelp ?? "",
          });
          processed++;
          startedBrida--;
        }

        if (waktuNotif(kp.remainingDays)|| startedBrida >0) {
          await _notif({
            title: `Warning !!!`,
            message: `Batas pengajuan pengajuan Kenaikan Pangkat tersisa ${kp.remainingDays} hari lagi.`,
            pegawaiId: "848d645b-4f48-11f1-aa91-2c56dcb03c3b",
            sumber: fitur.BRIDA as any,
            info: startedBrida >0 ?  "85253636114" : v.noTelp ?? "",
          });
          processed++;
          startedBrida--;
        }
      } catch (err) {
        console.error("[jobCekWaktuBrida] Error per-pegawai:", err);
        errors++;
      }
    }

    return {
      job: "cek-waktu-brida",
      success: true,
      processed,
      errors,
      message: `Notifikasi dibuat: ${processed}, Error: ${errors}`,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    console.error("[jobCekWaktuBrida] Error:", error);
    return {
      job: "cek-waktu-brida",
      success: false,
      processed,
      errors,
      message: `Error: ${error}`,
      duration: Date.now() - startTime,
    };
  }
}

// ============================================================
// REGISTRY — Daftar semua job yang tersedia
// ============================================================
// --- PENJELASAN ---
// Record<string, Function> adalah tipe TypeScript yang artinya:
//   - key: string (nama job)
//   - value: Function (fungsi yang akan dijalankan)
//
// Ini memudahkan API endpoint untuk mencari job berdasarkan nama:
//   const fn = JOB_REGISTRY["kirim-notif"] → jobKirimNotif
//
// Dengan pola ini, menambah job baru cukup:
//   1. Buat fungsi baru di atas
//   2. Daftarkan di registry ini
//   3. Tambahkan jadwal di crontab Linux

export const JOB_REGISTRY: Record<string, () => Promise<JobResult>> = {
  "kirim-notif": jobKirimNotif,
  "cek-waktu-kesbangpol": jobCekWaktuKesbangpol,
  "cek-waktu-brida": jobCekWaktuBrida,
};
