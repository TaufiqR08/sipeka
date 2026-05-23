import { prisma } from "@/lib/prisma";
import Fcuti from "@/components/Form/Fcuti";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function BaruCutiPage() {

  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const { role, pegawaiId, bidangId } = user; 

  const dtBidang = await prisma.bidang.findMany({
    where: {
      id: bidangId,
    },
    include: {
      dinas: {
        include: {
          pimpinan: true,
        },
      },
      pimpinan: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const all = await prisma.pegawai.findMany({
    orderBy: { nip: "asc" }
  });

  const dtUser = all.filter(p => p.id === pegawaiId);
  const dtLuar = all.filter(p => p.nip.length === 1);

  const { pimpinan, dinas, jabatan } = dtBidang[0];

  // Cari Sekretaris Badan (pimpinan bidang Sekretariat)
  const bidangSekban = await prisma.bidang.findFirst({
    where: { jab: "Sekretaris" },
    include: { pimpinan: true },
  });
  const sekban = bidangSekban?.pimpinan;
  const kaban = dinas?.pimpinan;

  // Bupati dari data "luar" (nip = "1")
  const bupati = dtLuar[0];
  // Sekda belum ada di database, buat placeholder
  const sekdaPlaceholder = {
    jab: "Sekretaris Daerah Kabupaten Sumbawa Barat",
    nm: "Sekretaris Daerah",
    nip: "", // kosong dulu sampai data ada
  };

  // =============================================
  // TENTUKAN ATASAN BERDASARKAN ROLE
  // =============================================
  let atasan1 = { jab: "", nm: "", nip: "" };
  let atasan2 = { jab: "", nm: "", nip: "" };

  if (role === "SEKRETARIS_BADAN") {
    // Atasan 1 = Kepala Badan, Atasan 2 = Sekda (placeholder)
    atasan1 = {
      jab: (kaban?.jabatan ?? "KEPALA BADAN") + " " + dinas.nm,
      nm: kaban?.nama ?? "",
      nip: kaban?.nip ?? "",
    };
    atasan2 = sekdaPlaceholder;

  } else if (role === "KEPALA_BADAN" || role === "ADMIN") {
    // Atasan 1 = Sekda (placeholder), Atasan 2 = Bupati
    atasan1 = sekdaPlaceholder;
    atasan2 = {
      jab: bupati?.jabatan ?? "BUPATI",
      nm: bupati?.nama ?? "",
      nip: "", // Bupati belum punya akun, notifikasi belum bisa dikirim
    };

  } else if (
    role === "KEPALA_BIDANG" ||
    role === "KABAG_UMUM_KEPEGAWAIAN"
  ) {
    // Atasan 1 = Sekban, Atasan 2 = Kepala Badan
    atasan1 = {
      jab: (sekban?.jabatan ?? "Sekretaris Badan") + " " + dinas.nm,
      nm: sekban?.nama ?? "",
      nip: sekban?.nip ?? "",
    };
    atasan2 = {
      jab: (kaban?.jabatan ?? "KEPALA BADAN") + " " + dinas.nm,
      nm: kaban?.nama ?? "",
      nip: kaban?.nip ?? "",
    };

  } else {
    // PEGAWAI biasa: Atasan 1 = Kabid/Sekban bidangnya, Atasan 2 = Kepala Badan
    atasan1 = {
      jab: jabatan + " " + dinas.nm,
      nm: pimpinan?.nama ?? "",
      nip: pimpinan?.nip ?? "",
    };
    atasan2 = {
      jab: (kaban?.jabatan ?? "KEPALA BADAN") + " " + dinas.nm,
      nm: kaban?.nama ?? "",
      nip: kaban?.nip ?? "",
    };
  }

  const data = {
    user: {
      jab: dtUser[0]?.jabatan,
      nm: dtUser[0]?.nama,
      nip: dtUser[0]?.nip,
    },
    bidang: atasan1,
    dinas: atasan2,
    bupati: {
      jab: dtLuar[0]?.jabatan,
      nm: dtLuar[0]?.nama,
      nip: "",
    },
    wakil: {
      jab: dtLuar[1]?.jabatan,
      nm: dtLuar[1]?.nama,
      nip: "",
    },
    bkd: {
      jab: dtLuar[2]?.jabatan,
      nm: dtLuar[2]?.nama,
      nip: "",
    },
  };


  let dcuti = await prisma.cuti.findFirst({
    where: {
      pegawaiId: pegawaiId,
      status: {
        not: "DISETUJUI",
      },
    },
  });

  return (
    <Fcuti
      rawData={data}
      dcuti={{ ...dcuti, ...JSON.parse(dcuti?.tt || "{}") }}
    />
  );
}