// Next.js Instrumentation — dijalankan otomatis saat server startup
// Docs: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

export async function register() {
  // Hanya jalankan di server (Node.js runtime), bukan di edge
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startNotifCron } = await import(
      "@/lib/cron/notifCron"
    );

    startNotifCron(); 

    console.log("✅ Cron jobs started via instrumentation");
  }
}
