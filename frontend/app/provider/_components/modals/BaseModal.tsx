"use client";

import { useMemo, useState } from "react";
import { AppNotification } from "@/lib/types/provider";
import RatingModal from "./RatingModal";
import { providerMarkNotificationRead } from "@/lib/actions/provider-actions";

export default function NotificationBell({
  unread,
  notifications,
}: {
  unread: number;
  notifications: AppNotification[];
}) {
  const [open, setOpen] = useState(false);
  const [ratingBookingId, setRatingBookingId] = useState<string | null>(null);
  const [ratingFromNotifId, setRatingFromNotifId] = useState<string | null>(null);

  const items = useMemo(() => notifications ?? [], [notifications]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative rounded-xl p-2 hover:bg-slate-100 transition"
        aria-label="Notifications"
      >
        <span className="text-xl">🔔</span>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-rose-500 text-white text-xs font-bold grid place-items-center">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="absolute right-6 top-20 w-[420px] max-w-[92vw] rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <div className="font-semibold text-slate-900">Notifications</div>
              <button className="text-slate-500 hover:text-slate-900" onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>

            <div className="max-h-[520px] overflow-auto">
              {items.length === 0 ? (
                <div className="p-6 text-sm text-slate-500">No notifications</div>
              ) : (
                items.map((n) => (
                  <button
                    key={n.id}
                    className={[
                      "w-full text-left px-5 py-4 border-b hover:bg-slate-50 transition",
                      n.isRead ? "opacity-80" : "bg-blue-50/40",
                    ].join(" ")}
                    onClick={async () => {
                      try {
                        if (!n.isRead) await providerMarkNotificationRead(n.id);
                      } catch {}
                      if (n.type === "rating_request" && n.bookingId) {
                        setRatingBookingId(n.bookingId);
                        setRatingFromNotifId(n.id);
                      }
                    }}
                  >
                    <div className="font-semibold text-slate-900">{n.title || "Notification"}</div>
                    <div className="text-sm text-slate-600">{n.message || ""}</div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {ratingBookingId && (
        <RatingModal
          bookingId={ratingBookingId}
          onClose={() => {
            setRatingBookingId(null);
            setRatingFromNotifId(null);
          }}
          onSubmitted={() => {
            setRatingBookingId(null);
            setRatingFromNotifId(null);
            setOpen(false);
          }}
        />
      )}
    </>
  );
}