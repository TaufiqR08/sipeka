"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  TrendingUp,
  Star,
  Users,
  LogOut,
  Bell,
} from "lucide-react";
import { LABEL_ROLE, Role } from "@/types";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    group: "Utama",
    roles: ["ADMIN", "KEPALA_BADAN", "SEKRETARIS_BADAN", "KABAG_UMUM_KEPEGAWAIAN", "KEPALA_BIDANG", "PEGAWAI"],
  },
  {
    label: "Pemberitahuan",
    href: "/dashboard/pemberitahuan",
    icon: Bell,
    group: "Utama",
    // Semua role bisa akses — data difilter berdasarkan role masing-masing
    roles: ["ADMIN", "KEPALA_BADAN", "KABAG_UMUM_KEPEGAWAIAN", "SEKRETARIS_BADAN", "KEPALA_BIDANG", "PEGAWAI"],
  },
  {
    label: "Pengajuan Cuti",
    href: "/dashboard/cuti",
    icon: CalendarDays,
    group: "Pengajuan",
    roles: ["ADMIN", "KEPALA_BADAN", "SEKRETARIS_BADAN", "KABAG_UMUM_KEPEGAWAIAN", "KEPALA_BIDANG", "PEGAWAI"],
  },
  {
    label: "Kenaikan Gaji Berkala",
    href: "/dashboard/layanan/KGB",
    icon: TrendingUp,
    group: "Pengajuan",
    roles: ["ADMIN", "KEPALA_BADAN", "SEKRETARIS_BADAN", "KABAG_UMUM_KEPEGAWAIAN", "KEPALA_BIDANG", "PEGAWAI"],
  },
  {
    label: "Kenaikan Pangkat",
    href: "/dashboard/layanan/KP",
    icon: Star,
    group: "Pengajuan",
    roles: ["ADMIN", "KEPALA_BADAN", "SEKRETARIS_BADAN", "KABAG_UMUM_KEPEGAWAIAN", "KEPALA_BIDANG", "PEGAWAI"],
  },
  {
    label: "Data Pegawai",
    href: "/dashboard/pegawai",
    icon: Users,
    group: "Data",
    roles: ["ADMIN", "KEPALA_BADAN", "SEKRETARIS_BADAN", "KABAG_UMUM_KEPEGAWAIAN", "KEPALA_BIDANG"],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();
  
  const user = session?.user as any;
  const userRole = user?.role as Role;

  const filteredNavItems = navItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );

  const groups = Array.from(new Set(filteredNavItems.map((n) => n.group)));

  const initials = (user?.nama ?? "?")
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/auth/login");
  };

  return (
    <aside className="w-64 bg-[#0B2545] flex flex-col flex-shrink-0 min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
        <div className="w-11 h-11 bg-[#C9A84C] rounded-xl flex items-center justify-center flex-shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#0B2545">
            <path d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5" />
          </svg>
        </div>
        <div>
          <div className="font-serif text-white text-sm font-semibold leading-tight">
            Kesbangpol
            <br />
            Sumbawa Barat
          </div>
          <div className="text-white/40 text-[10px] uppercase tracking-wider mt-0.5">
            SIMPEG v1.0
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4">
        {groups.map((group) => (
          <div key={group}>
            <div className="px-5 py-2 text-[10px] font-semibold text-white/30 uppercase tracking-widest">
              {group}
            </div>
            {filteredNavItems
              .filter((n) => n.group === group)
              .map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-5 py-2.5 text-[13.5px] font-medium transition-all border-l-[3px] ${
                      active
                        ? "bg-[#C9A84C]/12 text-[#E8C96A] border-[#C9A84C]"
                        : "text-white/60 border-transparent hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <item.icon
                      size={17}
                      className={active ? "opacity-100" : "opacity-70"}
                    />
                    {item.label}
                  </Link>
                );
              })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-[#C9A84C] flex items-center justify-center text-[#0B2545] font-bold text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="overflow-hidden">
            <div className="text-white text-[12.5px] font-semibold truncate">
              {user?.nama ?? "Memuat..."}
            </div>
            <div className="text-white/40 text-[10.5px]">
              {LABEL_ROLE[userRole] ?? "—"}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 text-white/40 hover:text-white text-[12px] py-1.5 transition-colors"
        >
          <LogOut size={14} />
          Keluar
        </button>
      </div>
    </aside>
  );
}
