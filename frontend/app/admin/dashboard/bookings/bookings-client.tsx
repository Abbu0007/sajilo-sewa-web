"use client";

import { useMemo, useState, useTransition } from "react";
import {
  AdminBookingItem,
  adminCancelBooking,
  adminDeleteBooking,
  adminListBookings,
} from "@/lib/actions/admin-bookings.actions";
import AdminBookingCard from "../../_components/AdminBookingCard";
import AdminBookingDetailsModal from "../../_components/AdminBookingDetailsModal";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const STATUSES = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "in_progress", label: "In Progress" },
  { key: "awaiting_payment_confirmation", label: "Awaiting Payment" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "rejected", label: "Rejected" },
];

export default function BookingsClient({
  initial,
  initialStatus,
  initialQuery,
}: {
  initial: { items: AdminBookingItem[]; page: number; limit: number; total: number; totalPages: number };
  initialStatus: string;
  initialQuery: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [q, setQ] = useState(initialQuery);

  const [data, setData] = useState(initial);
  const [pending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<AdminBookingItem | null>(null);

  const stats = useMemo(() => {
    const total = data.total ?? 0;
    const shown = data.items?.length ?? 0;
    return { total, shown };
  }, [data.total, data.items]);

  function reload(next?: { status?: string; q?: string; page?: number }) {
    const nextStatus = next?.status ?? status;
    const nextQ = next?.q ?? q;
    const nextPage = next?.page ?? data.page ?? 1;

    startTransition(async () => {
      const fresh = await adminListBookings({
        status: nextStatus,
        q: nextQ,
        page: nextPage,
        limit: data.limit ?? 12,
      });
      setData(fresh);
    });
  }

  function openDetails(b: AdminBookingItem) {
    setActive(b);
    setOpen(true);
  }

  async function onCancel(bookingId: string, reason?: string) {
    await adminCancelBooking(bookingId, reason);
    setOpen(false);
    setActive(null);
    reload();
  }

  async function onDelete(bookingId: string) {
    setData((prev) => ({
      ...prev,
      items: (prev.items || []).filter((x) => x.id !== bookingId),
      total: Math.max(0, (prev.total ?? 0) - 1),
    }));
    setOpen(false);
    setActive(null);

    try {
      await adminDeleteBooking(bookingId);
      reload();
    } catch {
      reload();
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-white/90 text-sm font-semibold">
                Sajilo Sewa • Admin
              </div>
              <h2 className="text-white text-xl sm:text-2xl font-extrabold tracking-tight">
                Bookings
              </h2>
              <p className="text-white/80 text-sm">
                View all bookings with client/provider ratings, payment and status.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white ring-1 ring-white/20">
                Total: {stats.total}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white ring-1 ring-white/20">
                Showing: {stats.shown}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s.key}
                  onClick={() => {
                    setStatus(s.key);
                    reload({ status: s.key, page: 1 });
                  }}
                  className={cn(
                    "rounded-2xl px-4 py-2 text-sm font-semibold ring-1 transition",
                    status === s.key
                      ? "bg-white text-slate-900 ring-white/60"
                      : "bg-white/10 text-white ring-white/20 hover:bg-white/15"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="flex w-full gap-2 lg:w-[520px]">
              <div className="flex w-full items-center gap-2 rounded-2xl bg-white/95 px-3 py-2 ring-1 ring-white/40">
                <span className="text-slate-500">🔎</span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search client / provider / service / address..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>
              <button
                onClick={() => reload({ q, page: 1 })}
                disabled={pending}
                className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-white/40 hover:bg-white/90 disabled:opacity-60"
              >
                {pending ? "Searching..." : "Search"}
              </button>
              <button
                onClick={() => {
                  setQ("");
                  reload({ q: "", page: 1 });
                }}
                className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/15"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 flex items-center justify-between text-sm text-slate-600">
          <div>
            Page <span className="font-semibold">{data.page}</span> of{" "}
            <span className="font-semibold">{data.totalPages}</span>
          </div>
          <button
            onClick={() => reload()}
            disabled={pending}
            className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {pending ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(data.items || []).map((b) => (
          <AdminBookingCard key={b.id} booking={b} onOpen={() => openDetails(b)} />
        ))}
      </div>

      {(data.items || []).length === 0 && (
        <div className="rounded-3xl bg-white p-10 text-center text-slate-500 shadow-sm ring-1 ring-slate-200">
          No bookings found.
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          disabled={pending || (data.page ?? 1) <= 1}
          onClick={() => reload({ page: Math.max(1, (data.page ?? 1) - 1) })}
          className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 disabled:opacity-60"
        >
          Prev
        </button>

        <div className="text-xs text-slate-500">
          {pending ? "Loading..." : "Ready"}
        </div>

        <button
          disabled={pending || (data.page ?? 1) >= (data.totalPages ?? 1)}
          onClick={() => reload({ page: Math.min((data.totalPages ?? 1), (data.page ?? 1) + 1) })}
          className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 disabled:opacity-60"
        >
          Next
        </button>
      </div>

      {open && active && (
        <AdminBookingDetailsModal
          booking={active}
          onClose={() => {
            setOpen(false);
            setActive(null);
          }}
          onCancel={onCancel}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}