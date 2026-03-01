"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  X,
  Star,
  CalendarClock,
  MapPin,
  FileText,
  BadgeIndianRupee,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import type { AdminBookingItem } from "@/lib/actions/admin-bookings.actions";
import { toUploadsPath } from "@/lib/utils/media";
import StatusPill from "./StatusPill";

function initials(first?: string, last?: string, fallback = "U") {
  const a = (first ?? "").trim().charAt(0);
  const b = (last ?? "").trim().charAt(0);
  const out = `${a}${b}`.toUpperCase();
  return out || fallback;
}

export default function AdminBookingDetailsModal({
  booking,
  onClose,
  onCancel,
  onDelete,
}: {
  booking: AdminBookingItem;
  onClose: () => void;
  onCancel: (bookingId: string, reason?: string) => Promise<void>;
  onDelete: (bookingId: string) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [cancelOpen, setCancelOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [reason, setReason] = useState("");

  const serviceName = booking.service?.name ?? "Service";
  const client = booking.client ?? null;
  const provider = booking.provider ?? null;

  const clientName = client ? `${client.firstName ?? ""} ${client.lastName ?? ""}`.trim() : "Client";
  const providerName = provider ? `${provider.firstName ?? ""} ${provider.lastName ?? ""}`.trim() : "Provider";

  const whenText = useMemo(() => {
    try {
      return booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleString() : "—";
    } catch {
      return "—";
    }
  }, [booking.scheduledAt]);

  const price = Number(booking.price ?? 0);
  const payment = String(booking.paymentStatus ?? "unpaid");
  const canCancel = String(booking.status ?? "").toLowerCase() !== "completed";
  const canDelete = true;

  async function run(fn: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setErr(null);
    try {
      await fn();
    } catch (e: any) {
      setErr(e?.message ?? "Action failed");
      setBusy(false);
      return;
    }
    setBusy(false);
  }

  return (
    <>
      <div className="fixed inset-0 z-[120]">
        <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={onClose} />

        <div
          className="absolute left-1/2 top-1/2 w-[860px] max-w-[94vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[28px] border border-white/20 bg-white shadow-[0_40px_140px_rgba(2,6,23,0.25)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-5 sm:p-6 border-b border-slate-200">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">
                  {serviceName}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Booking ID: <span className="font-bold">{booking.id}</span>
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

          <div className="p-5 sm:p-6 space-y-4">
            {err ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
                {err}
              </div>
            ) : null}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl overflow-hidden border border-slate-200 bg-white grid place-items-center">
                    {client?.avatarUrl ? (
                      <Image
                        src={toUploadsPath(client.avatarUrl)}
                        alt="client avatar"
                        width={48}
                        height={48}
                        className="h-12 w-12 object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="font-extrabold text-slate-700">
                        {initials(client?.firstName, client?.lastName, "C")}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-500">Client</div>
                    <div className="font-extrabold text-slate-900 truncate">{clientName}</div>
                    <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200 px-3 py-1 text-xs font-extrabold">
                      <Star className="h-3.5 w-3.5" />
                      {Number(client?.ratingAvg ?? 0).toFixed(1)}
                      <span className="font-bold text-amber-600">
                        ({Number(client?.ratingCount ?? 0)})
                      </span>
                      <span className="text-amber-700/70 font-black">•</span>
                      {Number(client?.completedBookings ?? 0)} completed
                    </div>
                  </div>
                </div>
              </div>

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
                      <span className="font-extrabold text-slate-700">
                        {initials(provider?.firstName, provider?.lastName, "P")}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-500">Provider</div>
                    <div className="font-extrabold text-slate-900 truncate">{providerName}</div>
                    <div className="text-xs text-slate-600 truncate">
                      {(provider?.profession ?? "").trim() ? provider?.profession : "Professional"}
                      {" • "}
                      {(provider?.serviceSlug ?? "").trim() ? provider?.serviceSlug : "service"}
                    </div>

                    <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 px-3 py-1 text-xs font-extrabold">
                      <Star className="h-3.5 w-3.5" />
                      {Number(provider?.ratingAvg ?? 0).toFixed(1)}
                      <span className="font-bold text-indigo-600">
                        ({Number(provider?.ratingCount ?? 0)})
                      </span>
                      <span className="text-indigo-700/70 font-black">•</span>
                      {Number(provider?.completedBookings ?? 0)} completed
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
                  <CalendarClock className="h-4 w-4" /> When
                </div>
                <div className="mt-1 text-sm font-extrabold text-slate-900">{whenText}</div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-bold text-slate-500">Status</div>
                <div className="mt-2">
                  <StatusPill status={booking.status} />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
                  <BadgeIndianRupee className="h-4 w-4" /> Payment
                </div>
                <div className="mt-1 text-sm font-extrabold text-slate-900">
                  {price > 0 ? `Rs ${price.toLocaleString()}` : "—"}
                  <span className="text-slate-300 font-black"> • </span>
                  {payment}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Address
                </div>
                <div className="mt-1 text-sm font-extrabold text-slate-900">
                  {booking.addressText?.trim() ? booking.addressText : "—"}
                </div>
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

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-1">
              <button
                onClick={onClose}
                className="h-11 rounded-2xl px-5 font-semibold border border-slate-200 bg-white hover:bg-slate-50 transition"
              >
                Close
              </button>

              <button
                disabled={!canCancel || busy}
                onClick={() => {
                  setErr(null);
                  setCancelOpen(true);
                }}
                className="h-11 rounded-2xl px-5 font-extrabold bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60 transition inline-flex items-center justify-center gap-2"
              >
                <ShieldAlert className="h-4 w-4" />
                Cancel Booking
              </button>

              <button
                disabled={!canDelete || busy}
                onClick={() => {
                  setErr(null);
                  setDeleteOpen(true);
                }}
                className="h-11 rounded-2xl px-5 font-extrabold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60 transition inline-flex items-center justify-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Booking
              </button>
            </div>
          </div>
        </div>
      </div>

      {cancelOpen ? (
        <div className="fixed inset-0 z-[130]">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={() => setCancelOpen(false)} />

          <div className="absolute left-1/2 top-1/2 w-[520px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white shadow-[0_30px_120px_rgba(0,0,0,0.25)] ring-1 ring-black/5 overflow-hidden">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <div>
                <div className="text-lg font-extrabold text-slate-900">Cancel booking</div>
                <div className="text-sm text-slate-600">This will set status to cancelled.</div>
              </div>
              <button
                onClick={() => setCancelOpen(false)}
                className="h-10 w-10 rounded-2xl border bg-white hover:bg-slate-50 grid place-items-center"
                type="button"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-slate-700" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs font-semibold text-slate-600">Reason (optional)</div>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Provider unavailable / policy issue / duplicate booking"
                  className="mt-2 w-full min-h-[90px] rounded-2xl border px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-rose-200"
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setCancelOpen(false)}
                  className="h-11 rounded-2xl px-5 font-semibold border bg-white hover:bg-slate-50"
                  type="button"
                >
                  Close
                </button>
                <button
                  onClick={() =>
                    run(async () => {
                      await onCancel(booking.id, reason.trim() ? reason.trim() : undefined);
                    })
                  }
                  disabled={busy}
                  className="h-11 rounded-2xl px-6 font-extrabold bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60"
                  type="button"
                >
                  {busy ? "Cancelling..." : "Confirm Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {deleteOpen ? (
        <div className="fixed inset-0 z-[130]">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={() => setDeleteOpen(false)} />

          <div className="absolute left-1/2 top-1/2 w-[520px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white shadow-[0_30px_120px_rgba(0,0,0,0.25)] ring-1 ring-black/5 overflow-hidden">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <div>
                <div className="text-lg font-extrabold text-slate-900">Delete booking</div>
                <div className="text-sm text-slate-600">
                  This removes the booking permanently (also deletes notifications and ratings).
                </div>
              </div>
              <button
                onClick={() => setDeleteOpen(false)}
                className="h-10 w-10 rounded-2xl border bg-white hover:bg-slate-50 grid place-items-center"
                type="button"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-slate-700" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                Are you sure you want to delete this booking? This action cannot be undone.
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteOpen(false)}
                  className="h-11 rounded-2xl px-5 font-semibold border bg-white hover:bg-slate-50"
                  type="button"
                >
                  Close
                </button>
                <button
                  onClick={() =>
                    run(async () => {
                      await onDelete(booking.id);
                    })
                  }
                  disabled={busy}
                  className="h-11 rounded-2xl px-6 font-extrabold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60"
                  type="button"
                >
                  {busy ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}