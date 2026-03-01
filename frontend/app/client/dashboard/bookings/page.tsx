export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { getMyBookings } from "@/lib/actions/client-actions";
import ClientBookingsClient from "./bookings-client";

const tabs = [
  "all",
  "pending",
  "confirmed",
  "in_progress",
  "awaiting_payment_confirmation",
  "completed",
  "cancelled",
];

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams; 
  const status = (sp?.status ?? "all").toString();

  const res = await getMyBookings(status).catch(() => ({ items: [] }));
  const items = res.items || [];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] ring-1 ring-black/5 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xl font-extrabold text-slate-900">My Bookings</div>
            <div className="text-sm text-slate-600">Track bookings by status.</div>
          </div>

          <div className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
            Total: {items.length}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <Link
              key={t}
              href={`/client/dashboard/bookings?status=${encodeURIComponent(t)}`}
              prefetch={false}
              className={[
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                t === status
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200",
              ].join(" ")}
            >
              {t.replaceAll("_", " ")}
            </Link>
          ))}
        </div>
      </div>

      <ClientBookingsClient initialItems={items} />
    </div>
  );
}