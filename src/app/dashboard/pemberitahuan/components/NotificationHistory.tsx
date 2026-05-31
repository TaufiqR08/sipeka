"use client";

import { useState, useCallback } from "react";
import {
  Search,
  Filter,
  CheckCheck,
  Bell,
  CalendarDays,
  TrendingUp,
  Star,
  Clock,
  Check,
  X,
  AlertCircle,
  Info,
  ChevronDown,
  Loader2,
} from "lucide-react";

interface NotificationData {
  id: string;
  title: string;
  message: string;
  sumber: "CUTI" | "KGB" | "KP";
  send: boolean;
  info?: string | null;
  createdAt: string;
  pegawai?: {
    nama: string;
    nip: string;
  };
}

interface Props {
  initialData: NotificationData[];
  totalCount: number;
  isAdmin: boolean;
}

const SUMBER_CONFIG = {
  CUTI: {
    label: "Cuti",
    icon: CalendarDays,
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-600",
    badgeBg: "bg-indigo-50",
    badgeText: "text-indigo-700",
    borderColor: "border-indigo-200",
  },
  KGB: {
    label: "KGB",
    icon: TrendingUp,
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-600",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    borderColor: "border-emerald-200",
  },
  KP: {
    label: "Kenaikan Pangkat",
    icon: Star,
    bgColor: "bg-amber-100",
    textColor: "text-amber-600",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    borderColor: "border-amber-200",
  },
};

export function NotificationHistory({ initialData, totalCount, isAdmin }: Props) {
  const [notifications, setNotifications] = useState<NotificationData[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialData.length < totalCount);

  // Filters
  const [search, setSearch] = useState("");
  const [sumberFilter, setSumberFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const fetchNotifications = useCallback(
    async (pageNum: number, append: boolean = false) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", String(pageNum));
        params.set("limit", "20");
        if (sumberFilter) params.set("sumber", sumberFilter);
        if (statusFilter) params.set("status", statusFilter);
        if (search.trim()) params.set("search", search.trim());

        const res = await fetch(`/api/notifications?${params.toString()}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();

        if (append) {
          setNotifications((prev) => [...prev, ...(data.notifications ?? [])]);
        } else {
          setNotifications(data.notifications ?? []);
        }

        const pagination = data.pagination;
        setHasMore(pagination.page < pagination.totalPages);
      } catch (_) {
      } finally {
        setLoading(false);
      }
    },
    [sumberFilter, statusFilter, search]
  );

  // Apply filters
  const applyFilters = () => {
    setPage(1);
    fetchNotifications(1, false);
  };

  // Load more
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage, true);
  };

  // Mark single as read
  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, send: true } : n))
    );
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (_) {}
  };

  // Mark all as read
  const markAllAsRead = async () => {
    setMarkingAll(true);
    setNotifications((prev) => prev.map((n) => ({ ...n, send: true })));
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
    } catch (_) {
    } finally {
      setMarkingAll(false);
    }
  };

  // Format time relative
  const formatTime = (isoString: string) => {
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return "Baru saja";
    if (mins < 60) return `${mins} menit lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} hari lalu`;
    return new Date(isoString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Format full date for group header
  const formatDateGroup = (isoString: string) => {
    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Hari Ini";
    if (date.toDateString() === yesterday.toDateString()) return "Kemarin";

    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Group notifications by date
  const groupedNotifications = notifications.reduce<
    Record<string, NotificationData[]>
  >((groups, notif) => {
    const dateKey = new Date(notif.createdAt).toDateString();
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(notif);
    return groups;
  }, {});

  // Get notification icon based on title
  const getStatusIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("disetujui") || t.includes("✓") || t.includes("berhasil"))
      return <Check size={14} />;
    if (t.includes("ditolak") || t.includes("✗") || t.includes("gagal"))
      return <X size={14} />;
    if (t.includes("warning") || t.includes("batas") || t.includes("menunggu"))
      return <AlertCircle size={14} />;
    return <Info size={14} />;
  };

  const getStatusColor = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("disetujui") || t.includes("✓") || t.includes("berhasil"))
      return "text-green-500";
    if (t.includes("ditolak") || t.includes("✗") || t.includes("gagal"))
      return "text-red-500";
    if (t.includes("warning") || t.includes("batas") || t.includes("menunggu"))
      return "text-amber-500";
    return "text-blue-500";
  };

  const unreadCount = notifications.filter((n) => !n.send).length;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md w-full">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Cari pemberitahuan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter Sumber */}
            <div className="relative">
              <select
                value={sumberFilter}
                onChange={(e) => {
                  setSumberFilter(e.target.value);
                  setTimeout(() => {
                    setPage(1);
                    const params = new URLSearchParams();
                    params.set("page", "1");
                    params.set("limit", "20");
                    if (e.target.value) params.set("sumber", e.target.value);
                    if (statusFilter) params.set("status", statusFilter);
                    if (search.trim()) params.set("search", search.trim());
                    fetch(`/api/notifications?${params.toString()}`, { cache: "no-store" })
                      .then((r) => r.json())
                      .then((data) => {
                        setNotifications(data.notifications ?? []);
                        setHasMore(data.pagination.page < data.pagination.totalPages);
                      });
                  }, 0);
                }}
                className="appearance-none pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all cursor-pointer"
              >
                <option value="">Semua Sumber</option>
                <option value="CUTI">📅 Cuti</option>
                <option value="KGB">💰 KGB</option>
                <option value="KP">⭐ Kenaikan Pangkat</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>

            {/* Filter Status */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setTimeout(() => {
                    setPage(1);
                    const params = new URLSearchParams();
                    params.set("page", "1");
                    params.set("limit", "20");
                    if (sumberFilter) params.set("sumber", sumberFilter);
                    if (e.target.value) params.set("status", e.target.value);
                    if (search.trim()) params.set("search", search.trim());
                    fetch(`/api/notifications?${params.toString()}`, { cache: "no-store" })
                      .then((r) => r.json())
                      .then((data) => {
                        setNotifications(data.notifications ?? []);
                        setHasMore(data.pagination.page < data.pagination.totalPages);
                      });
                  }, 0);
                }}
                className="appearance-none pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all cursor-pointer"
              >
                <option value="">Semua Status</option>
                <option value="unread">🔵 Belum Dibaca</option>
                <option value="read">✅ Sudah Dibaca</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>

            {/* Search button */}
            <button
              onClick={applyFilters}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors active:scale-95"
            >
              <Search size={16} />
            </button>

            {/* Mark all read */}
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={markingAll}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {markingAll ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <CheckCheck size={14} />
                )}
                <span className="hidden sm:inline">Tandai Semua Dibaca</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notification Timeline */}
      {notifications.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedNotifications).map(([dateKey, items]) => (
            <div key={dateKey}>
              {/* Date Group Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300 ring-4 ring-gray-100 flex-shrink-0" />
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                  {formatDateGroup(items[0].createdAt)}
                </h3>
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {items.length} notifikasi
                </span>
              </div>

              {/* Items */}
              <div className="ml-[5px] border-l-2 border-gray-200 pl-6 space-y-3">
                {items.map((notif) => {
                  const config = SUMBER_CONFIG[notif.sumber];
                  const SumberIcon = config.icon;

                  return (
                    <div
                      key={notif.id}
                      className={`relative bg-white rounded-xl border p-4 transition-all duration-200 hover:shadow-md group ${
                        !notif.send
                          ? "border-blue-200 shadow-sm ring-1 ring-blue-100"
                          : "border-gray-200"
                      }`}
                    >
                      {/* Unread indicator dot on timeline */}
                      {!notif.send && (
                        <div className="absolute -left-[31px] top-5 w-3 h-3 rounded-full bg-blue-500 ring-2 ring-white" />
                      )}

                      <div className="flex items-start gap-3">
                        {/* Sumber Icon */}
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bgColor}`}
                        >
                          <SumberIcon size={18} className={config.textColor} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${config.badgeBg} ${config.badgeText} border ${config.borderColor}`}
                                >
                                  {config.label}
                                </span>
                                <span className={`flex items-center gap-1 ${getStatusColor(notif.title)}`}>
                                  {getStatusIcon(notif.title)}
                                </span>
                                {!notif.send && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                )}
                              </div>
                              <h4
                                className={`text-sm font-semibold truncate ${
                                  !notif.send ? "text-gray-900" : "text-gray-700"
                                }`}
                              >
                                {notif.title}
                              </h4>
                              <p
                                className={`text-xs leading-relaxed mt-0.5 line-clamp-2 ${
                                  !notif.send ? "text-gray-600" : "text-gray-500"
                                }`}
                              >
                                {notif.message}
                              </p>

                              {/* Admin: show pegawai name */}
                              {isAdmin && notif.pegawai && (
                                <p className="text-[10px] text-gray-400 mt-1">
                                  👤 {notif.pegawai.nama} ({notif.pegawai.nip})
                                </p>
                              )}
                            </div>

                            {/* Time & Actions */}
                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                              <span className="text-[11px] text-gray-400 flex items-center gap-1 whitespace-nowrap">
                                <Clock size={11} />
                                {formatTime(notif.createdAt)}
                              </span>
                              {!notif.send && (
                                <button
                                  onClick={() => markAsRead(notif.id)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 mt-1"
                                >
                                  <Check size={12} />
                                  Tandai dibaca
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Load More */}
          {hasMore && (
            <div className="text-center pt-2">
              <button
                onClick={loadMore}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm disabled:opacity-50 active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Memuat...
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} />
                    Muat Lebih Banyak
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell size={32} className="text-gray-300" />
          </div>
          <h3 className="text-gray-900 font-bold text-lg">Tidak Ada Pemberitahuan</h3>
          <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">
            {search || sumberFilter || statusFilter
              ? "Tidak ada notifikasi yang cocok dengan filter Anda. Coba ubah filter."
              : "Belum ada aktivitas yang tercatat dalam sistem."}
          </p>
          {(search || sumberFilter || statusFilter) && (
            <button
              onClick={() => {
                setSearch("");
                setSumberFilter("");
                setStatusFilter("");
                setPage(1);
                fetch("/api/notifications?page=1&limit=20", { cache: "no-store" })
                  .then((r) => r.json())
                  .then((data) => {
                    setNotifications(data.notifications ?? []);
                    setHasMore(data.pagination.page < data.pagination.totalPages);
                  });
              }}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
            >
              <X size={14} />
              Hapus Semua Filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}
