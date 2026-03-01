"use client";

import Image from "next/image";
import { Star, BadgeIndianRupee, CalendarClock, UserRound } from "lucide-react";
import type { AdminBookingItem } from "@/lib/actions/admin-bookings.actions";
import { toUploadsPath } from "@/lib/utils/media";
import StatusPill from "./StatusPill";

function initials(first?: string, last?: string, fallback = "U") {
  const a = (first ?? "").trim().charAt(0);
  const b = (last ?? "").trim().charAt(0);
  const out = `${a}${b}`.toUpperCase();
  return out || fallback;
}

export default function AdminBookingCard({
  booking,
  onOpen,
}: {
  booking: AdminBookingItem;
  onOpen: () => void;
}) {
  const serviceName = booking.service?.name ?? "Service";

  const client = booking.client ?? null;
  const provider = booking.provider ?? null;

  const clientName = client ? `${client.firstName ?? ""} ${client.lastName ?? ""}`.trim() : "Client";
  const providerName = provider ? `${provider.firstName ?? ""} ${provider.lastName ?? ""}`.trim() : "Provider";

  const when = booking.scheduledAt
    ? (() => {
        try {
          return new Date(booking.scheduledAt).toLocaleString();
        } catch {
          return "—";
        }
      })()
    : "—";

  const price = Number(booking.price ?? 0);
  const payment = String(booking.paymentStatus ?? "unpaid");

  const cr = Number(client?.ratingAvg ?? 0).toFixed(1);
  const crc = Number(client?.ratingCount ?? 0);

  const pr = Number(provider?.ratingAvg ?? 0).toFixed(1);
  const prc = Number(provider?.ratingCount ?? 0);

  return (
    <button
      onClick={onOpen}
      className="group text-left rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 hover:shadow-md transition overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-500">Service</div>
            <div className="mt-1 text-lg font-extrabold text-slate-900 truncate">
              {serviceName}
            </div>
          </div>
          <StatusPill status={booking.status} />
        </div>

        <div className="mt-4 grid gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl overflow-hidden bg-slate-100 ring-1 ring-slate-200 grid place-items-center">
              {client?.avatarUrl ? (
                <Image
                  src={toUploadsPath(client.avatarUrl)}
                  alt="client avatar"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-cover"
                  unoptimized
                />
              ) : (
                <span className="text-xs font-extrabold text-slate-700">
                  {initials(client?.firstName, client?.lastName, "C")}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
                <UserRound className="h-3.5 w-3.5" /> Client
              </div>
              <div className="font-extrabold text-slate-900 truncate">
                {clientName || "Client"}
              </div>

              <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200 px-3 py-1 text-xs font-extrabold">
                <Star className="h-3.5 w-3.5" />
                {cr}
                <span className="font-bold text-amber-600">({crc})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl overflow-hidden bg-slate-100 ring-1 ring-slate-200 grid place-items-center">
              {provider?.avatarUrl ? (
                <Image
                  src={toUploadsPath(provider.avatarUrl)}
                  alt="provider avatar"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-cover"
                  unoptimized
                />
              ) : (
                <span className="text-xs font-extrabold text-slate-700">
                  {initials(provider?.firstName, provider?.lastName, "P")}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-500">Provider</div>
              <div className="font-extrabold text-slate-900 truncate">
                {providerName || "Provider"}
              </div>

              <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 px-3 py-1 text-xs font-extrabold">
                <Star className="h-3.5 w-3.5" />
                {pr}
                <span className="font-bold text-indigo-600">({prc})</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
              <CalendarClock className="h-4 w-4" />
              <span className="truncate max-w-[320px]">{when}</span>
            </div>

            <div className="inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-3 py-1 text-xs font-extrabold">
                <BadgeIndianRupee className="h-3.5 w-3.5" />
                {price > 0 ? `Rs ${price.toLocaleString()}` : "—"}
              </span>

              {price > 0 ? (
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold ring-1 ${
                    payment === "paid"
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                      : "bg-slate-50 text-slate-700 ring-slate-200"
                  }`}
                >
                  {payment}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/60">
        <div className="text-xs text-slate-500 truncate">
          {booking.addressText?.trim() ? booking.addressText : "No address provided"}
        </div>
      </div>
    </button>
  );
}