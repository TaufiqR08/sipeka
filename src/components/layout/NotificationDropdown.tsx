"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Bell, Check, Info, AlertCircle, Clock, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  link?: string | null;
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications ?? []);
      setUnreadCount(data.unreadCount ?? 0);
    } catch (_) {}
  }, []);

  // Fetch saat pertama mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Polling setiap 30 detik
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (notif: NotificationItem) => {
    if (!notif.isRead) {
      // Optimistic update
      setNotifications((prev) => prev.map((n) => n.id === notif.id ? { ...n, isRead: true } : n));
      setUnreadCount((c) => Math.max(0, c - 1));
      try {
        await fetch("/api/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: notif.id }),
        });
      } catch (_) {}
    }
    if (notif.link) {
      setIsOpen(false);
      router.push(notif.link);
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    } catch (_) {}
  };

  const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("disetujui") || t.includes("✓")) return <Check size={15} />;
    if (t.includes("ditolak") || t.includes("✗")) return <X size={15} />;
    if (t.includes("warning") || t.includes("batas")) return <AlertCircle size={15} />;
    return <Info size={15} />;
  };

  const getIconStyle = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("disetujui") || t.includes("✓")) return "bg-green-100 text-green-600";
    if (t.includes("ditolak") || t.includes("✗")) return "bg-red-100 text-red-600";
    if (t.includes("warning") || t.includes("batas")) return "bg-amber-100 text-amber-600";
    return "bg-blue-100 text-blue-600";
  };

  const formatTime = (isoString: string) => {
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return "Baru saja";
    if (mins < 60) return `${mins} menit lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    return `${days} hari lalu`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => { setIsOpen(!isOpen); if (!isOpen) fetchNotifications(); }}
        title="Pemberitahuan"
        className={`p-2 rounded-lg transition-all relative ${isOpen ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100 text-gray-600"}`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fadeIn origin-top-right">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">
              Notifikasi
              {unreadCount > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full">
                  {unreadCount} baru
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 uppercase tracking-wider"
              >
                Tandai semua dibaca
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-50">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer group relative ${!n.isRead ? "bg-blue-50/30" : ""}`}
                  onClick={() => markAsRead(n)}
                >
                  <div className="flex gap-3">
                    <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${getIconStyle(n.title)}`}>
                      {getIcon(n.title)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`text-xs font-bold truncate ${!n.isRead ? "text-gray-900" : "text-gray-600"}`}>
                          {n.title}
                        </p>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap flex items-center gap-1 ml-2">
                          <Clock size={10} />
                          {formatTime(n.createdAt)}
                        </span>
                      </div>
                      <p className={`text-[11px] leading-relaxed line-clamp-2 ${!n.isRead ? "text-gray-700" : "text-gray-500"}`}>
                        {n.message}
                      </p>
                    </div>
                  </div>
                  {!n.isRead && (
                    <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-full" />
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Bell size={32} className="mx-auto text-gray-200 mb-2" />
                <p className="text-xs text-gray-500">Tidak ada notifikasi</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
            <span className="text-[10px] text-gray-400">Diperbarui otomatis setiap 30 detik</span>
          </div>
        </div>
      )}
    </div>
  );
}
