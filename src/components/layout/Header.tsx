"use client";
import { usePathname } from "next/navigation";
import { ChevronRight, Bell, Settings } from "lucide-react";
import { NotificationDropdown } from "./NotificationDropdown";

const breadcrumbLabels: Record<string, string> = {
  dashboard: "Dashboard",
  cuti: "Pengajuan Cuti",
  kgb: "Kenaikan Gaji Berkala",
  pangkat: "Kenaikan Pangkat",
  pegawai: "Data Pegawai",
  pemberitahuan: "Pemberitahuan",
};

export function Header() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const getBreadcrumbs = () => {
    const crumbs = [{ label: "Dashboard", href: "/dashboard" }];
    if (segments.length > 1) {
      const key = segments[1];
      crumbs.push({
        label: breadcrumbLabels[key] || key,
        href: `/dashboard/${key}`,
      });
    }
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          {breadcrumbs.map((crumb, idx) => (
            <div key={crumb.href} className="flex items-center gap-2">
              <a
                href={crumb.href}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {crumb.label}
              </a>
              {idx < breadcrumbs.length - 1 && (
                <ChevronRight size={16} className="text-gray-400" />
              )}
            </div>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <NotificationDropdown />
          <button
            title="Pengaturan"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
