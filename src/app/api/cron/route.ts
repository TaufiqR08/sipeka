// ============================================================
// API Endpoint: /api/cron
// ============================================================
//
// ENDPOINT INI MENGGANTIKAN node-cron
//
// Cara kerja:
//   1. Linux crontab menjalankan: curl http://localhost:3000/api/cron?job=kirim-notif
//   2. Endpoint ini menerima request tersebut
//   3. Menjalankan fungsi job yang diminta
//   4. Mengembalikan hasil (berhasil/gagal) sebagai JSON
//
// KEAMANAN:
//   - Endpoint dilindungi oleh CRON_SECRET (token rahasia)
//   - Tanpa token yang benar, request akan ditolak (401 Unauthorized)
//   - Token dikirim via header: Authorization: Bearer <token>
//
// JOB YANG TERSEDIA:
//   ?job=kirim-notif           → Kirim WA notifikasi tertunda
//   ?job=cek-waktu-kesbangpol  → Cek deadline KGB/KP Kesbangpol
//   ?job=cek-waktu-brida       → Cek deadline KGB/KP BRIDA
//   ?job=all                   → Jalankan SEMUA job sekaligus
//
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { JOB_REGISTRY } from "@/lib/cron/cronAlt";

// --- PENJELASAN ---
// Kita ambil CRON_SECRET dari environment variable.
// Ini adalah token rahasia yang harus cocok dengan yang dikirim oleh crontab.
// Jika tidak ada env variable, gunakan default (HARUS DIGANTI di production!)
const CRON_SECRET = process.env.CRON_SECRET || "sipeka-cron-secret-2026";

// ============================================================
// GET /api/cron?job=<nama-job>
// ============================================================
// --- PENJELASAN ---
// Di Next.js App Router, setiap HTTP method punya fungsi sendiri:
//   export async function GET()  → handle GET request
//   export async function POST() → handle POST request
//
// Kita pakai GET karena crontab biasanya pakai curl sederhana:
//   curl http://localhost:3000/api/cron?job=kirim-notif

export async function GET(request: NextRequest) {
  // ----------------------------------------------------------
  // STEP 1: Validasi keamanan (Authentication)
  // ----------------------------------------------------------
  // --- PENJELASAN ---
  // request.headers.get("authorization") mengambil header Authorization
  // dari HTTP request. Format yang diharapkan: "Bearer <token>"
  //
  // .replace("Bearer ", "") menghapus prefix "Bearer " agar tersisa tokennya saja.
  // Contoh: "Bearer sipeka-cron-secret-2024" → "sipeka-cron-secret-2024"

  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (token !== CRON_SECRET) {
    // --- PENJELASAN ---
    // Jika token tidak cocok, kembalikan error 401 (Unauthorized).
    // Ini mencegah orang asing menjalankan cron job kita.
    console.log("[CRON API] ❌ Unauthorized access attempt");
    return NextResponse.json(
      { error: "Unauthorized. Token tidak valid." },
      { status: 401 }
    );
  }

  // ----------------------------------------------------------
  // STEP 2: Ambil nama job dari query parameter
  // ----------------------------------------------------------
  // --- PENJELASAN ---
  // request.nextUrl.searchParams.get("job") mengambil nilai parameter "job"
  // dari URL. Contoh:
  //   URL: /api/cron?job=kirim-notif
  //   Hasil: "kirim-notif"

  const jobName = request.nextUrl.searchParams.get("job");

  if (!jobName) {
    // Jika tidak ada parameter "job", tampilkan daftar job yang tersedia
    return NextResponse.json(
      {
        error: "Parameter 'job' diperlukan",
        available_jobs: [...Object.keys(JOB_REGISTRY), "all"],
        usage: "/api/cron?job=kirim-notif",
      },
      { status: 400 }
    );
  }

  // ----------------------------------------------------------
  // STEP 3: Jalankan job
  // ----------------------------------------------------------

  console.log(`[CRON API] ▶ Menjalankan job: ${jobName}`);

  try {
    // --- PENJELASAN ---
    // Jika job = "all", jalankan SEMUA job satu per satu.
    // Object.entries() mengubah object menjadi array of [key, value]:
    //   { "kirim-notif": fn1, "cek-waktu": fn2 }
    //   → [["kirim-notif", fn1], ["cek-waktu", fn2]]

    if (jobName === "all") {
      const results = [];
      for (const [name, fn] of Object.entries(JOB_REGISTRY)) {
        console.log(`[CRON API]   → Menjalankan: ${name}`);
        const result = await fn();
        results.push(result);
        console.log(`[CRON API]   ✓ ${name}: ${result.message}`);
      }
      return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        results,
      });
    }

    // --- PENJELASAN ---
    // Cari fungsi job di registry berdasarkan nama.
    // JOB_REGISTRY["kirim-notif"] → fungsi jobKirimNotif
    const jobFn = JOB_REGISTRY[jobName];

    if (!jobFn) {
      return NextResponse.json(
        {
          error: `Job '${jobName}' tidak ditemukan`,
          available_jobs: [...Object.keys(JOB_REGISTRY), "all"],
        },
        { status: 404 }
      );
    }

    // Jalankan fungsi job dan tunggu hasilnya
    const result = await jobFn();
    console.log(`[CRON API] ✓ ${jobName}: ${result.message} (${result.duration}ms)`);

    return NextResponse.json({
      success: result.success,
      timestamp: new Date().toISOString(),
      result,
    });
  } catch (error) {
    console.error(`[CRON API] ✗ Error job ${jobName}:`, error);
    return NextResponse.json(
      {
        success: false,
        error: `Job gagal: ${error}`,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
