import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { Bell, CheckCircle, CalendarDays, TrendingUp, Star } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/sfBGS";
import { NotificationHistory } from "./components/NotificationHistory";

export default async function PemberitahuanPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const { role, pegawaiId, nama } = user;

  const adminAccess = isAdmin(role);

  // Where clause berdasarkan role
  const baseWhere: any = adminAccess ? {} : { pegawaiId };

  // Statistik
  const [total, unread, cutiCount, kgbCount, kpCount] = await Promise.all([
    prisma.notification.count({ where: baseWhere }),
    prisma.notification.count({ where: { ...baseWhere, send: false } }),
    prisma.notification.count({ where: { ...baseWhere, sumber: "CUTI" } }),
    prisma.notification.count({ where: { ...baseWhere, sumber: "KGB" } }),
    prisma.notification.count({ where: { ...baseWhere, sumber: "KP" } }),
  ]);

  // Initial data (halaman pertama)
  const initialNotifications = await prisma.notification.findMany({
    where: baseWhere,
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      pegawai: {
        select: { nama: true, nip: true },
      },
    },
  });

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pemberitahuan</h1>
          <p className="text-gray-600 mt-2">
            {adminAccess
              ? "Pantau seluruh aktivitas dan notifikasi sistem dari semua pegawai."
              : "Riwayat pemberitahuan dan aktivitas Anda di dalam sistem."}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{total}</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Bell size={20} className="text-gray-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Belum Dibaca</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{unread}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle size={20} className="text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Cuti</p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">{cutiCount}</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <CalendarDays size={20} className="text-indigo-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">KGB / KP</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{kgbCount + kpCount}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <TrendingUp size={20} className="text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Notification History (Client Component) */}
        <NotificationHistory
          initialData={JSON.parse(JSON.stringify(initialNotifications))}
          totalCount={total}
          isAdmin={adminAccess}
        />
      </div>
    </ProtectedLayout>
  );
}
