import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Start seeding...");

   await prisma.kategoriDokumen.createMany({
    data: [
      {
        idKate: "KGB",
        nmKate: "Kenaikan Gaji Berkala",
        ket: "Kelola pengajuan KGB dan upload dokumen pendukung",
      },
      {
        idKate: "KP",
        nmKate: "Kenaikan Pangkat",
        ket: "Kelola pengajuan kenaikan pangkat dan dokumen pendukung",
      },
    ],
    skipDuplicates: true,
  });

  // 1. Seed Bidang
  const bidangData = [
    { kode: "SEK", nama: "Sekretariat" },
    { kode: "IDK", nama: "Bidang Ideologi dan Karakter Bangsa" },
    { kode: "KWN", nama: "Bidang Kewaspadaan dan Ketahanan Nasional" },
    { kode: "POL", nama: "Bidang Politik Dalam Negeri dan Ormas" },
  ];

  // ======================
  // DINAS
  // ======================

  const dinas = await prisma.dinas.upsert({
    where: {
      id: "8.01.0.00.0.00.01.0000",
    },

    update: {
      nm: "Kesatuan Bangsa dan Politik",
    },

    create: {
      id: "8.01.0.00.0.00.01.0000",
      nm: "Kesatuan Bangsa dan Politik",
    },
  });

  console.log("✅ Dinas seeded");

  // ======================
  // BIDANG
  // ======================

  const bidangList = [
    {
      id: "78111549-3a71-4fcd-ad4a-c19d3f1c2121",
      nm: "Sekretariat Badan",
      jabatan: "Sekretariat Badan",
      jab: "Sekretaris",
    },

    {
      id: "11111111-3a71-4fcd-ad4a-c19d3f1c2121",
      nm: "Bidang Ideologi",
      jabatan: "Kepala Bidang Ideologi",
      jab: "Kabid Ideologi",
    },

    {
      id: "22222222-3a71-4fcd-ad4a-c19d3f1c2121",
      nm: "Bidang Politik Dalam Negeri",
      jabatan: "Kepala Bidang Politik",
      jab: "Kabid Politik",
    },

    {
      id: "33333333-3a71-4fcd-ad4a-c19d3f1c2121",
      nm: "Bidang Ketahanan Ekonomi",
      jabatan: "Kepala Bidang Ketahanan",
      jab: "Kabid Ketahanan",
    },
  ];

  const bidangMap: Record<string, any> = {};

  for (const item of bidangList) {
    const result = await prisma.bidang.upsert({
      where: {
        id: item.id,
      },

      update: {
        ...item,
        dinasId: dinas.id,
      },

      create: {
        ...item,
        dinasId: dinas.id,
      },
    });

    bidangMap[item.nm] = result;

    console.log(`✅ Bidang: ${item.nm}`);
  }

  // ======================
  // PEGAWAI
  // ======================

  const pegawaiList = [
    {
      nip: "197805122008121001",
      nama: "Dr. H. Ahmad Yani, M.Si",
      jabatan: "Kepala Badan",
      pangkat: "Pembina Utama Muda",
      golonganRuang: "IV/c",
      tmtGolongan: new Date("2020-04-01"),
      unitKerja: "Sekretariat",
      masaKerja: "22 Tahun",
      tglMasaKerja: new Date("2002-12-01"),

      bidangId: bidangMap["Sekretariat Badan"].id,

      email: "kaban@sipeka.go.id",
      role: Role.ADMIN,
    },

    {
      nip: "198203102010121002",
      nama: "H. Muhammad Zaini, S.T",
      jabatan: "Kabag Umum & Kepegawaian",
      pangkat: "Penata Tk. I",
      golonganRuang: "III/d",
      tmtGolongan: new Date("2021-04-01"),
      unitKerja: "Sekretariat",
      masaKerja: "14 Tahun",
      tglMasaKerja: new Date("2010-12-01"),

      bidangId: bidangMap["Sekretariat Badan"].id,

      email: "kabag@sipeka.go.id",
      role: Role.ADMIN,
    },

    {
      nip: "199001152015122004",
      nama: "Budi Setiawan, S.Kom",
      jabatan: "Analis Sistem Informasi",
      pangkat: "Penata Muda Tk. I",
      golonganRuang: "III/b",
      tmtGolongan: new Date("2021-10-01"),
      unitKerja: "Bidang Ideologi",
      masaKerja: "8 Tahun",
      tglMasaKerja: new Date("2015-12-01"),

      bidangId: bidangMap["Sekretariat Badan"].id,

      email: "staff@sipeka.go.id",
      role: Role.PEGAWAI,
    },

    {
      nip: "1",
      nama: "Amar Nurmansyah",
      jabatan: "BUPATI",
      pangkat: null,
      golonganRuang: "-",
      tmtGolongan: null,
      unitKerja: null,
      masaKerja: null,
      tglMasaKerja: null,

      bidangId: null,

      email: null,
      role: null,
    },

    {
      nip: "2",
      nama: "HJ",
      jabatan: "WAKIL BUPATI",
      pangkat: null,
      golonganRuang: "-",
      tmtGolongan: null,
      unitKerja: null,
      masaKerja: null,
      tglMasaKerja: null,

      bidangId: null,

      email: null,
      role: null,
    },{
      nip: "3",
      nama: "BKD",
      jabatan: "Kepala BKPSDM",
      pangkat: null,
      golonganRuang: "-",
      tmtGolongan: null,
      unitKerja: null,
      masaKerja: null,
      tglMasaKerja: null,

      bidangId: null,

      email: null,
      role: null,
    },
  ];

  const pegawaiMap: Record<string, any> = {};

  for (const item of pegawaiList) {
    const { email, role, ...pegawaiData } = item;

    const pegawai = await prisma.pegawai.upsert({
      where: {
        nip: pegawaiData.nip,
      },

      update: {
        ...pegawaiData,
      },

      create: {
        ...pegawaiData,

        ...(email
          ? {
              user: {
                create: {
                  email,
                  password: passwordHash,
                  role: role || Role.PEGAWAI,
                },
              },
            }
          : {}),
      },

      include: {
        user: true,
      },
    });

    pegawaiMap[pegawai.nip] = pegawai;

    console.log(`✅ Pegawai: ${pegawai.nama}`);
  }

  // ======================
  // UPDATE PIMPINAN DINAS
  // ======================

  await prisma.dinas.update({
    where: {
      id: dinas.id,
    },

    data: {
      pimpinanId:
        pegawaiMap["197805122008121001"].id,
    },
  });

  // ======================
  // UPDATE PIMPINAN BIDANG
  // ======================

  await prisma.bidang.update({
    where: {
      id: bidangMap["Sekretariat Badan"].id,
    },

    data: {
      pimpinanId:
        pegawaiMap["198203102010121002"].id,
    },
  });


   // ambil kategori dulu
  const kp = await prisma.kategoriDokumen.findFirst({
    where: { nmKate: "KP" },
  });

  const kgb = await prisma.kategoriDokumen.findFirst({
    where: { nmKate: "KGB" },
  });

  if (!kp || !kgb) {
    throw new Error("Kategori KP / KGB belum ada. Jalankan seed kategori dulu.");
  }

  // =========================
  // KP
  // =========================
  const kpDocs = [
    "SKP 2 tahun terakhir",
    "SK CPNS",
    "SK PNS",
    "SK Pangkat Terakhir",
    "Surat Pengantar",
    "SK Jabatan Terakhir",
  ];

  // =========================
  // KGB
  // =========================
  const kgbDocs = [
    "Surat Pengantar",
    "SK CPNS",
    "SK PNS",
    "SK Pangkat Terakhir",
    "SK Jabatan Terakhir",
    "SKP 2 tahun terakhir",
    "SK Berkala Terakhir",
  ];

  // helper insert
  const insertDocs = async (kategoriId: string, docs: string[]) => {
    for (const doc of docs) {
      await prisma.daftarDokumen.upsert({
        where: {
          idDaft: `${kategoriId}-${doc}`, // unique key sederhana
        },
        update: {},
        create: {
          idDaft: `${kategoriId}-${doc}`,
          idKate: kategoriId,
          nmDaft: doc,
          ketDaft: null,
        },
      });
    }
  };

  await insertDocs(kp.idKate, kpDocs);
  await insertDocs(kgb.idKate, kgbDocs);
  
  console.log("✅ Relasi pimpinan updated");

  console.log("🎉 Seeder selesai");
}

main()
  .catch((e) => {
    console.error(e);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });