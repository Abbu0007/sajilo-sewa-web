"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import GlassCard from "./ui/GlassCard";
import Button from "./ui/Button";
import { getNotifications, markNotificationRead, NotificationItem } from "@/lib/actions/client-actions";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      const res = await getNotifications();
      setItems(res.items || []);
    } catch (e: any) {
      setError(e?.message ?? "Request failed");
    }
  }

  useEffect(() => {
    if (open) load();
  }, [open]);

  const unread = items.filter((i) => !i.isRead).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative h-11 w-11 rounded-2xl border border-white/35 bg-white/60 hover:bg-white/75 transition grid place-items-center"
      >
        <Bell className="h-5 w-5 text-slate-700" />
        {unread > 0 ? (
          <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-rose-600 text-white text-[11px] font-extrabold grid place-items-center">
            {unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 mt-3 w-[320px] z-50">
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div className="font-extrabold text-slate-900">Notifications</div>
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>

            {error ? (
              <div className="mt-3 text-sm text-rose-600">{error}</div>
            ) : null}

            <div className="mt-3 max-h-[340px] overflow-auto space-y-2">
              {items.length === 0 ? (
                <div className="text-sm text-slate-600">No notifications yet.</div>
              ) : (
                items.map((n) => (
                  <button
                    key={n._id}
                    onClick={async () => {
                      try {
                        await markNotificationRead(n._id);
                        await load();
                      } catch {}
                    }}
                    className={`w-full text-left rounded-xl border border-white/35 p-3 transition ${
                      n.isRead ? "bg-white/55" : "bg-blue-50/70 hover:bg-blue-50"
                    }`}
                  >
                    <div className="font-extrabold text-slate-900 text-sm">
                      {n.title ?? "Notification"}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">{n.message ?? ""}</div>
                  </button>
                ))
              )}
            </div>
          </GlassCard>
        </div>
      ) : null}
    </div>
  );
}
