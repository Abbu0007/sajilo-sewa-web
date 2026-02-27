"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { X, CalendarClock, MapPin, FileText, BadgeIndianRupee, ShieldAlert } from "lucide-react";
import type { BookingItem } from "@/lib/actions/client-actions";
import { cancelMyBooking } from "@/lib/actions/client-actions";
import { toUploadsPath } from "@/lib/utils/media";
import PaymentModal from "./PaymentModal";

function canCancel(status: string) {
  const s = String(status ?? "").toLowerCase();
  // allow cancel before completion
  return s === "pending" || s === "confirmed";
}

export default function ClientBookingDetailsModal({
  booking,
  onClose,
  onChanged,
}: {
  booking: BookingItem;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [payOpen, setPayOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [reason, setReason] = useState("");

  const provider = booking.providerId as any;
  const service = booking.serviceId as any;

  const initials =
    `${provider?.firstName?.[0] ?? ""}${provider?.lastName?.[0] ?? ""}`
      .trim()
      .toUpperCase() || "P";

  const showPayCTA =
    String(booking.status ?? "") === "awaiting_payment_confirmation" &&
    (booking.paymentStatus ?? "") !== "paid" &&
    (booking.price ?? 0) > 0;

  const showCancel = canCancel(booking.status);

  const whenText = useMemo(() => {
    try {
      return booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleString() : "—";
    } catch {
      return "—";
    }
  }, [booking.scheduledAt]);

  async function doCancel() {
    if (cancelling) return;
    setCancelling(true);
    try {
      await cancelMyBooking(booking._id, reason?.trim() ? reason.trim() : undefined);
      onClose();
      onChanged();
    } finally {
      setCancelling(false);
    }
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[9998] bg-black/45 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] grid place-items-center p-4">
        <div
          className="w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/20 bg-white shadow-[0_40px_140px_rgba(2,6,23,0.25)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-200">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">
                  {service?.name ?? "Service"} •{" "}
                  {provider ? `${provider.firstName} ${provider.lastName}` : "Provider"}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Booking ID: <span className="font-bold">{booking._id}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="h-10 w-10 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 grid place-items-center transition"
                aria-label="close"
              >
                <X className="h-5 w-5 text-slate-700" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 space-y-4">
            {/* Provider mini card */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl overflow-hidden border border-slate-200 bg-white grid place-items-center">
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
                    {provider ? `${provider.firstName} ${provider.lastName}` : "Provider"}
                  </div>
                  <div className="text-xs text-slate-600 truncate">
                    {provider?.profession ?? "Professional"} • {provider?.serviceSlug ?? "service"}
                  </div>
                </div>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
                  <CalendarClock className="h-4 w-4" /> When
                </div>
                <div className="mt-1 text-sm font-extrabold text-slate-900">{whenText}</div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Address
                </div>
                <div className="mt-1 text-sm font-extrabold text-slate-900">
                  {booking.addressText?.trim() ? booking.addressText : "—"}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
                  <BadgeIndianRupee className="h-4 w-4" /> Payment
                </div>
                <div className="mt-1 text-sm font-extrabold text-slate-900">
                  {typeof booking.price === "number" && booking.price > 0 ? `Rs ${booking.price}` : "—"}
                  <span className="text-slate-300 font-black"> • </span>
                  {booking.paymentStatus ?? "unpaid"}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-bold text-slate-500">Status</div>
                <div className="mt-1 text-sm font-extrabold text-slate-900">{booking.status}</div>
              </div>
            </div>

            {booking.note?.trim() ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Note
                </div>
                <div className="mt-1 text-sm text-slate-800">{booking.note}</div>
              </div>
            ) : null}

            {/* Cancel block */}
            {showCancel ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
                <div className="text-xs font-extrabold text-rose-700 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4" /> Cancel booking
                </div>
                <div className="mt-2 flex flex-col sm:flex-row gap-2">
                  <input
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Reason (optional)"
                    className="h-11 w-full rounded-2xl px-4 border border-rose-200 bg-white text-slate-900 outline-none"
                  />
                  <button
                    onClick={doCancel}
                    disabled={cancelling}
                    className="h-11 rounded-2xl px-5 font-extrabold bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60"
                  >
                    {cancelling ? "Cancelling..." : "Cancel"}
                  </button>
                </div>
              </div>
            ) : null}

            {/* Footer actions */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                onClick={onClose}
                className="h-11 rounded-2xl px-5 font-semibold border border-slate-200 bg-white hover:bg-slate-50 transition"
              >
                Close
              </button>

              {showPayCTA ? (
                <button
                  onClick={() => setPayOpen(true)}
                  className="h-11 rounded-2xl px-6 font-extrabold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm ring-1 ring-black/10"
                >
                  Pay Now
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {payOpen ? (
        <PaymentModal
          open
          bookingId={booking._id}
          amount={Number(booking.price ?? 0)}
          onClose={() => setPayOpen(false)}
          onPaid={() => {
            setPayOpen(false);
            onClose();
            onChanged();
          }}
        />
      ) : null}
    </>
  );
}