import { prisma } from "@/lib/prisma";

// ============================================
// HELPER: Kirim pesan WhatsApp via Fonnte API
// ============================================

/**
 * Format nomor telepon ke format internasional (628xxx)
 * Mendukung input: 08xxx, +628xxx, 628xxx
 */
function formatNomorHP(noTelp: string): string {
  let nomor = noTelp.replace(/[\s\-\(\)]/g, ""); // hapus spasi, strip, kurung
  if (nomor.startsWith("+")) nomor = nomor.slice(1);
  if (nomor.startsWith("0")) nomor = "62" + nomor.slice(1);
  return nomor;
}

/**
 * Kirim pesan WhatsApp melalui Fonnte API
 * Non-blocking: jika gagal hanya log error, tidak melempar exception
 */
async function kirimWhatsApp(noTelp: string, message: string) {
  const token = process.env.WHATSAPP_TOKEN;
  if (!token || token === "your_fonnte_token_here") return; // skip jika token belum diset
  if (!noTelp) return; // skip jika nomor kosong

  const target = formatNomorHP(noTelp);

  try {
    const res = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: new URLSearchParams({
        target,
        message,
      }),
    });

    const result = await res.json();
    if (!result.status) {
      console.error("[WA] Gagal kirim ke", target, ":", result.reason ?? result);
    }
  } catch (err) {
    console.error("[WA] Error kirim WhatsApp:", err);
  }
}

// ============================================
// NOTIFIKASI IN-APP (Database)
// ============================================

/**
 * Kirim notifikasi ke satu user berdasarkan userId
 */
export async function kirimNotifikasi({
  userId,
  title,
  message,
  link,
}: {
  userId: string;
  title: string;
  message: string;
  link?: string;
}) {
  await prisma.notification.create({
    data: { userId, title, message, link: link ?? null },
  });
}

/**
 * Cari userId berdasarkan NIP pegawai, lalu kirim notifikasi
 * + kirim WhatsApp jika noTelp tersedia
 */
export async function kirimNotifikasiKeNip({
  nip,
  title,
  message,
  link,
}: {
  nip: string;
  title: string;
  message: string;
  link?: string;
}) {
  const user = await prisma.user.findFirst({
    where: { pegawai: { nip } },
    include: { pegawai: { select: { noTelp: true } } },
  });
  if (user) {
    await kirimNotifikasi({ userId: user.id, title, message, link });

    // Kirim WhatsApp
    if (user.pegawai?.noTelp) {
      await kirimWhatsApp(user.pegawai.noTelp, `*${title}*\n\n${message}`);
    }
  }
}

/**
 * Cari userId berdasarkan pegawaiId, lalu kirim notifikasi
 * + kirim WhatsApp jika noTelp tersedia
 */
export async function kirimNotifikasiKePegawaiId({
  pegawaiId,
  title,
  message,
  link,
}: {
  pegawaiId: string;
  title: string;
  message: string;
  link?: string;
}) {
  const user = await prisma.user.findFirst({
    where: { pegawaiId },
    include: { pegawai: { select: { noTelp: true } } },
  });
  if (user) {
    await kirimNotifikasi({ userId: user.id, title, message, link });

    // Kirim WhatsApp
    if (user.pegawai?.noTelp) {
      await kirimWhatsApp(user.pegawai.noTelp, `*${title}*\n\n${message}`);
    }
  }
}

/**
 * Kirim notifikasi ke semua user dengan role tertentu
 * + kirim WhatsApp ke masing-masing jika noTelp tersedia
 */
export async function kirimNotifikasiKeRole({
  role,
  title,
  message,
  link,
}: {
  role: string;
  title: string;
  message: string;
  link?: string;
}) {
  const users = await prisma.user.findMany({
    where: { role: role as any },
    include: { pegawai: { select: { noTelp: true } } },
  });
  await Promise.all(
    users.map(async (user) => {
      await kirimNotifikasi({ userId: user.id, title, message, link });

      // Kirim WhatsApp
      if (user.pegawai?.noTelp) {
        await kirimWhatsApp(user.pegawai.noTelp, `*${title}*\n\n${message}`);
      }
    })
  );
}

