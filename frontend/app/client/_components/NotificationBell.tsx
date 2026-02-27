"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell } from "lucide-react";
import {
  getNotifications,
  markNotificationRead,
  NotificationItem,
} from "@/lib/actions/client-actions";
import ClientRatingModal from "./modals/ClientRatingModal";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [ratingBookingId, setRatingBookingId] = useState<string | null>(null);
  const [ratingFromNotifId, setRatingFromNotifId] = useState<string | null>(null);
  const TOPBAR_OFFSET_CLASS = "top-[76px]"; 

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

  const unread = useMemo(() => items.filter((i) => !i.isRead).length, [items]);

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setOpen(true)}
          className="relative h-11 w-11 rounded-2xl grid place-items-center transition bg-amber-400 hover:bg-amber-500 shadow-sm ring-1 ring-black/10"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-white" />
          {unread > 0 ? (
            <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-rose-600 text-white text-[11px] font-extrabold grid place-items-center">
              {unread}
            </span>
          ) : null}
        </button>
      </div>
      {open ? (
        <div className="fixed inset-0 z-[150]">
          <div
            className={`absolute left-0 right-0 bottom-0 ${TOPBAR_OFFSET_CLASS} bg-black/55`}
            onClick={() => setOpen(false)}
          />

          <div className={`absolute right-6 ${TOPBAR_OFFSET_CLASS} mt-2 w-[420px] max-w-[92vw]`}>
            <div className="rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                <div className="font-extrabold text-slate-900">Notifications</div>
                <button
                  onClick={() => setOpen(false)}
                  className="h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition text-sm font-semibold text-slate-700"
                >
                  Close
                </button>
              </div>

              {error ? (
                <div className="px-5 pt-4 text-sm text-rose-600 font-semibold">
                  {error}
                </div>
              ) : null}

              <div className="max-h-[520px] overflow-auto">
                {items.length === 0 ? (
                  <div className="px-5 py-6 text-sm text-slate-500">
                    No notifications yet.
                  </div>
                ) : (
                  <div className="p-3 space-y-2">
                    {items.map((n) => {
                      const isRatingRequest = n.type === "rating_request" && !!n.bookingId;

                      return (
                        <button
                          key={n._id}
                          className={[
                            "w-full text-left rounded-xl border p-3 transition",
                            n.isRead
                              ? "bg-white border-slate-200 hover:bg-slate-50"
                              : "bg-blue-50/70 border-blue-100 hover:bg-blue-50",
                          ].join(" ")}
                          onClick={async () => {
                            try {
                              if (isRatingRequest) {
                                setRatingBookingId(n.bookingId!);
                                setRatingFromNotifId(n._id);
                                return;
                              }
                              if (!n.isRead) {
                                await markNotificationRead(n._id);
                                await load();
                              }
                            } catch {}
                          }}
                        >
                          <div className="font-extrabold text-slate-900 text-sm">
                            {n.title ?? "Notification"}
                          </div>
                          <div className="text-xs text-slate-600 mt-1">{n.message ?? ""}</div>

                          {isRatingRequest ? (
                            <div className="mt-2">
                              <span className="inline-flex items-center text-xs font-bold text-indigo-700 px-2 py-1 rounded-full bg-indigo-50 border border-indigo-100">
                                Tap to rate
                              </span>
                            </div>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {ratingBookingId ? (
        <ClientRatingModal
          bookingId={ratingBookingId}
          onClose={() => {
            setRatingBookingId(null);
            setRatingFromNotifId(null);
          }}
          onSubmitted={async () => {
            const notifId = ratingFromNotifId;

            setRatingBookingId(null);
            setRatingFromNotifId(null);
            setOpen(false);

            try {
              if (notifId) await markNotificationRead(notifId);
            } catch {}
          }}
        />
      ) : null}
    </>
  );
}