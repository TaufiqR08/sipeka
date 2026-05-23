const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Get all bidang
  const bidangList = await prisma.bidang.findMany({
    select: {
      id: true,
      nm: true,
      jabatan: true,
      pimpinanId: true,
    },
  });

  console.log("=== DAFTAR BIDANG ===");
  console.log("Total Bidang:", bidangList.length);
  console.table(bidangList.map(b => ({ ID: b.id.substring(0,8)+'...', Nama: b.nm, Jabatan: b.jabatan })));

  // Get all pegawai with their bidang
  const pegawaiList = await prisma.pegawai.findMany({
    select: {
      nama: true,
      jabatan: true,
      bidangId: true,
      bidang: {
        select: {
          nm: true,
        },
      },
    },
    orderBy: [
      { bidang: { nm: "asc" } },
      { nama: "asc" },
    ],
  });

  console.log("\n=== DATA PEGAWAI PER BIDANG ===");
  console.log("Total Pegawai:", pegawaiList.length);

  // Group by bidang
  const grouped = {};
  for (const p of pegawaiList) {
    const bidangNama = p.bidang?.nm || "TANPA BIDANG";
    if (!grouped[bidangNama]) grouped[bidangNama] = [];
    grouped[bidangNama].push({ Nama: p.nama, Jabatan: p.jabatan });
  }

  for (const [bidang, pegawais] of Object.entries(grouped)) {
    console.log(`\n--- ${bidang} (${pegawais.length} pegawai) ---`);
    console.table(pegawais);
  }

  // Check pegawai tanpa bidang
  const tanpaBidang = pegawaiList.filter(p => !p.bidangId);
  if (tanpaBidang.length > 0) {
    console.log(`\n⚠️  PERHATIAN: ${tanpaBidang.length} pegawai TANPA BIDANG!`);
    console.table(tanpaBidang.map(p => ({ Nama: p.nama, Jabatan: p.jabatan })));
  } else {
    console.log("\n✅ Semua pegawai sudah memiliki bidang.");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
