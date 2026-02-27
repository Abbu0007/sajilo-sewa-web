"use client";

import { useMemo, useState } from "react";
import NextImage from "next/image";
import { Star, CheckCircle2, X } from "lucide-react";
import { ProviderBooking } from "@/lib/types/provider";
import StatusPill from "../ui/StatusPill";
import {
  providerAcceptBooking,
  providerRejectBooking,
  providerUpdateBookingStatus,
} from "@/lib/actions/provider-actions";
import { toUploadsPath } from "@/lib/utils/media";

export default function BookingDetailsModal({
  booking,
  onClose,
  onChanged,
}: {
  booking: ProviderBooking;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [priceOpen, setPriceOpen] = useState(false);
  const [finalPrice, setFinalPrice] = useState<string>(() =>
    booking?.price && booking.price > 0 ? String(booking.price) : ""
  );

  const client = booking?.client ?? null;

  const clientName = client
    ? `${client.firstName ?? ""} ${client.lastName ?? ""}`.trim() || "Client"
    : "Client";

  const serviceName = booking?.service?.name || "Service";

  const date = booking?.scheduledAt ? new Date(booking.scheduledAt).toLocaleString() : "-";

  const status = useMemo(
    () => String(booking?.status ?? "").trim().toLowerCase(),
    [booking?.status]
  );

  const initials = useMemo(() => {
    const a = (client?.firstName ?? "").trim().charAt(0);
    const b = (client?.lastName ?? "").trim().charAt(0);
    const v = `${a}${b}`.toUpperCase();
    return v || "C";
  }, [client?.firstName, client?.lastName]);

  const rating = (client?.ratingAvg ?? 0).toFixed(1);
  const ratingCount = client?.ratingCount ?? 0;
  const completed = client?.completedBookings ?? 0;

  async function run(fn: () => Promise<any>) {
    setLoading(true);
    setErr(null);
    try {
      await fn();
      onChanged();
    } catch (e: any) {
      setErr(e?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  }

  async function submitFinalPrice() {
    const n = Number(finalPrice);
    if (!Number.isFinite(n) || n <= 0) {
      setErr("Please enter a valid final price");
      return;
    }

    await run(() =>
      providerUpdateBookingStatus(booking.id, "awaiting_payment_confirmation", {
        price: n,
      })
    );

    setPriceOpen(false);
  }

  const showPriceRow =
    status === "awaiting_payment_confirmation" ||
    status === "completed" ||
    (typeof booking.price === "number" && booking.price > 0);

  return (
    <>
      <div className="fixed inset-0 z-[120]">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

        <div className="absolute left-1/2 top-1/2 w-[680px] max-w-[94vw] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white shadow-[0_30px_120px_rgba(0,0,0,0.25)] ring-1 ring-black/5 overflow-hidden">
          <div className="px-6 py-5 border-b flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="h-14 w-14 rounded-2xl overflow-hidden bg-slate-100 grid place-items-center flex-shrink-0">
                {client?.avatarUrl ? (
                  <NextImage
                    src={toUploadsPath(client.avatarUrl)}
                    alt="client avatar"
                    width={56}
                    height={56}
                    className="h-14 w-14 object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="font-extrabold text-slate-700 text-lg">{initials}</span>
                )}
              </div>

              <div className="min-w-0">
                <div className="text-lg font-extrabold text-slate-900 truncate">{serviceName}</div>
                <div className="text-sm text-slate-600 truncate">{clientName}</div>
                <div className="text-xs text-slate-500 mt-1">{date}</div>

                <div className="mt-3 flex items-center gap-3 flex-wrap">
                  <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200 px-3 py-1 text-xs font-extrabold">
                    <Star className="h-3.5 w-3.5" />
                    {rating}
                    <span className="font-bold text-amber-600">({ratingCount})</span>
                  </div>

                  <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-3 py-1 text-xs font-extrabold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {completed} completed
                  </div>
                </div>
              </div>
            </div>

            <button
              className="text-slate-500 hover:text-slate-900"
              onClick={onClose}
              type="button"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {err && (
              <div className="rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">
                {err}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600">Status</div>
                <div className="mt-1">
                  <StatusPill status={booking.status} />
                </div>
              </div>

              {showPriceRow ? (
                <div className="text-right">
                  <div className="text-sm text-slate-600">Final price</div>
                  <div className="mt-1 text-lg font-extrabold text-slate-900">
                    Rs. {Number(booking.price ?? Number(finalPrice) ?? 0).toLocaleString()}
                  </div>
                  {status === "awaiting_payment_confirmation" ? (
                    <div className="text-xs text-slate-500">Waiting for client confirmation</div>
                  ) : booking.paymentStatus === "paid" ? (
                    <div className="text-xs text-emerald-700 font-semibold">Payment confirmed</div>
                  ) : null}
                </div>
              ) : null}
            </div>

            {booking?.note ? (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <span className="font-semibold">Note: </span>
                {booking.note}
              </div>
            ) : null}

            {booking?.addressText ? (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <span className="font-semibold">Address: </span>
                {booking.addressText}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3 pt-2">
              {status === "pending" && (
                <>
                  <button
                    disabled={loading}
                    className="rounded-2xl bg-blue-600 px-5 py-2.5 text-white font-bold hover:bg-blue-700 disabled:opacity-60"
                    onClick={() => run(() => providerAcceptBooking(booking.id))}
                    type="button"
                  >
                    Accept
                  </button>

                  <button
                    disabled={loading}
                    className="rounded-2xl border border-rose-200 bg-white px-5 py-2.5 text-rose-600 font-bold hover:bg-rose-50 disabled:opacity-60"
                    onClick={() => run(() => providerRejectBooking(booking.id))}
                    type="button"
                  >
                    Reject
                  </button>
                </>
              )}

              {status === "confirmed" && (
                <>
                  <button
                    disabled={loading}
                    className="rounded-2xl bg-purple-600 px-5 py-2.5 text-white font-bold hover:bg-purple-700 disabled:opacity-60"
                    onClick={() => run(() => providerUpdateBookingStatus(booking.id, "in_progress"))}
                    type="button"
                  >
                    Mark In Progress
                  </button>

                  <button
                    disabled={loading}
                    className="rounded-2xl border border-rose-200 bg-white px-5 py-2.5 text-rose-600 font-bold hover:bg-rose-50 disabled:opacity-60"
                    onClick={() => run(() => providerUpdateBookingStatus(booking.id, "cancelled"))}
                    type="button"
                  >
                    Cancel
                  </button>
                </>
              )}

              {status === "in_progress" && (
                <>
                  <button
                    disabled={loading}
                    className="rounded-2xl bg-emerald-600 px-5 py-2.5 text-white font-bold hover:bg-emerald-700 disabled:opacity-60"
                    onClick={() => {
                      setErr(null);
                      setPriceOpen(true);
                    }}
                    type="button"
                  >
                    Set Final Price
                  </button>

                  <button
                    disabled={loading}
                    className="rounded-2xl border border-rose-200 bg-white px-5 py-2.5 text-rose-600 font-bold hover:bg-rose-50 disabled:opacity-60"
                    onClick={() => run(() => providerUpdateBookingStatus(booking.id, "cancelled"))}
                    type="button"
                  >
                    Cancel
                  </button>
                </>
              )}

              {status === "awaiting_payment_confirmation" && (
                <div className="text-sm font-semibold text-slate-600">
                  Waiting for the client to confirm payment.
                </div>
              )}

              {status === "completed" && (
                <div className="text-sm font-semibold text-emerald-600">
                  Booking completed. {booking.paymentStatus === "paid" ? "Payment confirmed." : ""}
                </div>
              )}

              {status === "cancelled" && (
                <div className="text-sm font-semibold text-rose-600">Booking was cancelled.</div>
              )}

              {status === "rejected" && (
                <div className="text-sm font-semibold text-rose-600">You rejected this booking.</div>
              )}
            </div>

            {status === "in_progress" ? (
              <div className="text-xs text-slate-500">
                After service is done, set the <b>final price</b>. Client will confirm, then it becomes <b>completed</b>.
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {priceOpen ? (
        <div className="fixed inset-0 z-[130]">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setPriceOpen(false)}
          />

          <div className="absolute left-1/2 top-1/2 w-[520px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white shadow-[0_30px_120px_rgba(0,0,0,0.25)] ring-1 ring-black/5 overflow-hidden">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <div>
                <div className="text-lg font-extrabold text-slate-900">Final price</div>
                <div className="text-sm text-slate-600">Client will confirm this amount.</div>
              </div>
              <button
                onClick={() => setPriceOpen(false)}
                className="h-10 w-10 rounded-2xl border bg-white hover:bg-slate-50 grid place-items-center"
                type="button"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-slate-700" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs font-semibold text-slate-600">Enter final amount (Rs.)</div>
                <input
                  value={finalPrice}
                  onChange={(e) => setFinalPrice(e.target.value)}
                  placeholder="e.g. 2000"
                  inputMode="numeric"
                  className="mt-2 w-full h-12 rounded-2xl border px-4 bg-white outline-none focus:ring-2 focus:ring-blue-300"
                />
                <div className="mt-2 text-xs text-slate-500">
                  This will move booking to <b>awaiting payment confirmation</b>.
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setPriceOpen(false)}
                  className="h-11 rounded-2xl px-5 font-semibold border bg-white hover:bg-slate-50"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={submitFinalPrice}
                  disabled={loading}
                  className="h-11 rounded-2xl px-6 font-extrabold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                  type="button"
                >
                  {loading ? "Saving..." : "Send to Client"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}