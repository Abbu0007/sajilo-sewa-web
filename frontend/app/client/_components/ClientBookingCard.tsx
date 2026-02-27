"use client";

import Image from "next/image";
import type { BookingItem } from "@/lib/actions/client-actions";
import { toUploadsPath } from "@/lib/utils/media";

function statusPill(status: string) {
  const s = (status ?? "").toLowerCase();

  if (s === "completed") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s === "cancelled" || s === "canceled") return "bg-rose-50 text-rose-700 border-rose-200";
  if (s === "rejected") return "bg-rose-50 text-rose-700 border-rose-200";
  if (s === "in_progress" || s === "inprogress") return "bg-blue-50 text-blue-700 border-blue-200";
  if (s === "confirmed") return "bg-indigo-50 text-indigo-700 border-indigo-200";
  if (s === "awaiting_payment_confirmation")
    return "bg-amber-50 text-amber-700 border-amber-200";

  return "bg-slate-50 text-slate-700 border-slate-200";
}

export default function ClientBookingCard({ booking: b }: { booking: BookingItem }) {
  const provider = b.providerId as any;
  const service = b.serviceId as any;

  const initials =
    `${provider?.firstName?.[0] ?? ""}${provider?.lastName?.[0] ?? ""}`
      .trim()
      .toUpperCase() || "P";

  const showPayCTA =
    String(b.status ?? "") === "awaiting_payment_confirmation" &&
    (b.paymentStatus ?? "") !== "paid" &&
    (b.price ?? 0) > 0;

  return (
    <div className="h-full rounded-3xl bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] ring-1 ring-black/5 p-4 sm:p-5 flex flex-col">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="h-12 w-12 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 grid place-items-center flex-shrink-0">
            {provider?.avatarUrl ? (
              <Image
                src={toUploadsPath(provider.avatarUrl)}
                alt="provider avatar"
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
            <div className="font-extrabold text-slate-900 truncate">
              {service?.name ?? "Service"}{" "}
              <span className="text-slate-300 font-black">•</span>{" "}
              {provider ? `${provider.firstName} ${provider.lastName}` : "Provider"}
            </div>

            <div className="mt-1 text-xs text-slate-500">
              Booking ID: <span className="font-bold">{b._id}</span>
            </div>

            {typeof b.price === "number" && b.price > 0 ? (
              <div className="mt-1 text-xs text-slate-500">
                Price: <span className="font-extrabold text-slate-900">Rs {b.price}</span>{" "}
                <span className="text-slate-300 font-black">•</span>{" "}
                <span className="font-bold">{b.paymentStatus ?? "unpaid"}</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={[
              "text-xs rounded-full px-3 py-1 font-extrabold border",
              statusPill(b.status),
            ].join(" ")}
          >
            {b.status}
          </span>

          {showPayCTA ? (
            <span className="h-9 rounded-2xl px-4 font-extrabold bg-emerald-600 text-white grid place-items-center shadow-sm ring-1 ring-black/10">
              Pay
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
          <div className="text-xs font-bold text-slate-500">When</div>
          <div className="mt-1 text-sm font-extrabold text-slate-900">
            {b.scheduledAt ? new Date(b.scheduledAt).toLocaleString() : "—"}
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
          <div className="text-xs font-bold text-slate-500">Address</div>
          <div className="mt-1 text-sm font-extrabold text-slate-900">
            {b.addressText?.trim() ? b.addressText : "—"}
          </div>
        </div>
      </div>

      {/* ✅ Always render note block so heights match */}
      <div className="mt-3 rounded-2xl bg-white border border-slate-200 p-4 min-h-[86px]">
        <div className="text-xs font-bold text-slate-500">Note</div>
        <div className="mt-1 text-sm text-slate-800 line-clamp-2">
          {b.note?.trim() ? b.note : "—"}
        </div>
      </div>

      {/* ✅ Push footer to bottom */}
      <div className="mt-auto pt-4 text-xs text-slate-400">Click to view details</div>
    </div>
  );
}