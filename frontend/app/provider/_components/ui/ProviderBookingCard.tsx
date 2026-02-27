"use client";

import NextImage from "next/image";
import { ProviderBooking } from "@/lib/types/provider";
import StatusPill from "./StatusPill";
import { toUploadsPath } from "@/lib/utils/media";

export default function ProviderBookingCard({ booking }: { booking: ProviderBooking }) {
  const client = booking.client;
  const clientName = client ? `${client.firstName} ${client.lastName}` : "Client";
  const serviceName = booking.service?.name || "Service";
  const date = booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleString() : "-";

  const initials = client
    ? `${(client.firstName || "").charAt(0)}${(client.lastName || "").charAt(0)}`.toUpperCase()
    : "C";

  const rating = (client?.ratingAvg ?? 0).toFixed(1);
  const ratingCount = client?.ratingCount ?? 0;
  const completed = client?.completedBookings ?? 0;

  const showPrice =
    booking.status === "awaiting_payment_confirmation" ||
    booking.status === "completed" ||
    (typeof booking.price === "number" && booking.price > 0);

  return (
    <div className="w-full text-left rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-4 hover:bg-slate-50 transition cursor-pointer">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="h-12 w-12 rounded-2xl overflow-hidden border border-white/35 bg-white/60 grid place-items-center flex-shrink-0">
            {client?.avatarUrl ? (
              <NextImage
                src={toUploadsPath(client.avatarUrl)}
                alt="client avatar"
                width={48}
                height={48}
                className="h-12 w-12 object-cover"
                unoptimized
              />
            ) : (
              <span className="font-extrabold text-slate-700">{initials}</span>
            )}
          </div>

          <div className="min-w-0">
            <div className="font-semibold text-slate-900 truncate">{serviceName}</div>
            <div className="text-sm text-slate-600 truncate">{clientName}</div>

            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200 px-2.5 py-1 text-[11px] font-extrabold">
                ⭐ {rating}
                <span className="text-amber-600 font-bold">({ratingCount})</span>
              </span>

              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-2.5 py-1 text-[11px] font-extrabold">
                ✅ {completed} completed
              </span>

              {showPrice ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/5 text-slate-800 ring-1 ring-slate-200 px-2.5 py-1 text-[11px] font-extrabold">
                  Rs. {Number(booking.price ?? 0).toLocaleString()}
                  {booking.status === "awaiting_payment_confirmation" ? (
                    <span className="text-slate-500 font-black">• waiting</span>
                  ) : booking.paymentStatus === "paid" ? (
                    <span className="text-emerald-700 font-black">• paid</span>
                  ) : null}
                </span>
              ) : null}
            </div>

            <div className="text-xs text-slate-500 mt-2">{date}</div>

            {booking.addressText ? (
              <div className="text-xs text-slate-500 mt-1">{booking.addressText}</div>
            ) : null}
          </div>
        </div>

        <StatusPill status={booking.status} />
      </div>
    </div>
  );
}