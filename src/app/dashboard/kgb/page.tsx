import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { Plus } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Ltabel from "@/components/Layanan/Ltable";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { isAdmin, isKabid, isPegawai } from "@/lib/sfBGS";

const KGB_ID = "KGB";

export default async function KGBPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const { role, pegawaiId } = user;

  const kategori = await prisma.kategoriDokumen.findUnique({
    where: { idKate: KGB_ID },
  });

  if (!kategori) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>Data kategori KGB belum tersedia. Hubungi administrator.</p>
        </div>
      </ProtectedLayout>
    );
  }

  const me = await prisma.pegawai.findUnique({
    where: { id: pegawaiId },
  });

  let whereClause: any = {
    aktif: true,
    idKate: KGB_ID,
  };

  if (isPegawai(role)) {
    whereClause.pimpinanId = pegawaiId;
  } else if (isKabid(role)) {
    const pegawaiBidang = await prisma.pegawai.findMany({
      where: { bidangId: me?.bidangId },
    });
    whereClause.pimpinanId = {
      in: pegawaiBidang.map((v) => v.id),
    };
  }

  const dtabel = await prisma.layanan.findMany({
    where: whereClause,
    include: {
      pimpinan: true,
      listDokumen: true,
    },
  });

  const ddokument = await prisma.daftarDokumen.findMany({
    where: { idKate: KGB_ID },
  });

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {kategori.nmKate}
            </h1>
            <p className="text-gray-600 mt-2">
              {kategori.ket || "Kelola pengajuan KGB dan upload dokumen pendukung"}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href={"/dashboard/layanan/" + kategori.idKate + "/riwayat"}
              className="px-6 py-2 border border-gray-300 rounded-lg bg-green-800 text-white font-medium hover:bg-green-700 transition-colors"
            >
              Riwayat Pengajuan
            </Link>
            <Link
              href={"/dashboard/layanan/" + kategori.idKate + "/new"}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-md hover:shadow-lg active:scale-95 self-start"
            >
              <Plus size={20} />
              Buat Pengajuan KGB
            </Link>
          </div>
        </div>

        <Ltabel
          dtabel={dtabel}
          ddokument={ddokument}
          sf={{
            ...kategori,
          }}
        />
      </div>
    </ProtectedLayout>
  );
}
