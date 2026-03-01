export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import BookingDetailsClient from "../_ui/booking-details-client";
import ProviderBookingCard from "../../_components/ui/ProviderBookingCard";
import { providerGetBookings } from "@/lib/actions/provider-actions";

const tabs = [
  "all",
  "pending",
  "confirmed",
  "in_progress",
  "awaiting_payment_confirmation",
  "completed",
  "cancelled",
  "rejected",
];

export default async function ProviderBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams; 
  const status = (sp?.status ?? "all").toString();

  const items = await providerGetBookings(status).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6">
        <div className="text-lg font-semibold text-slate-900">Bookings</div>
        <div className="text-sm text-slate-500">Manage bookings by status.</div>

        <div className="mt-4 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <Link
              key={t}
              href={`/provider/dashboard/bookings?status=${encodeURIComponent(t)}`}
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.length === 0 ? (
          <div className="text-sm text-slate-500">No bookings found.</div>
        ) : (
          items.map((b) => (
            <BookingDetailsClient key={b.id} booking={b}>
              <ProviderBookingCard booking={b} />
            </BookingDetailsClient>
          ))
        )}
      </div>
    </div>
  );
}