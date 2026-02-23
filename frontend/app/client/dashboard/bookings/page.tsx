import { getMyBookings } from "@/lib/actions/client-actions";
import EmptyState from "../../_components/ui/EmptyState";
import GlassCard from "../../_components/ui/GlassCard";

export default async function BookingsPage() {
  const res = await getMyBookings("all");
  const items = res.items || [];

  return (
    <GlassCard className="p-5 sm:p-6 shadow-[0_30px_80px_rgba(15,23,42,0.10)]">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-extrabold text-slate-900">My Bookings</div>
          <div className="text-sm text-slate-600">Track all your service bookings.</div>
        </div>
      </div>

      <div className="mt-5">
        {items.length === 0 ? (
          <EmptyState title="No bookings yet" description="Book a provider from Home or Services." />
        ) : (
          <div className="space-y-4">
            {items.map((b) => (
              <div
                key={b._id}
                className="rounded-3xl bg-white/70 backdrop-blur border border-white/40
                           shadow-[0_18px_50px_rgba(2,6,23,0.10)]
                           p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-extrabold text-slate-900">
                    {b.serviceId?.name ?? "Service"}{" "}
                    <span className="text-slate-400 font-black">•</span>{" "}
                    {b.providerId ? `${b.providerId.firstName} ${b.providerId.lastName}` : "Provider"}
                  </div>

                  <span
                    className="text-xs rounded-full px-3 py-1 font-extrabold
                               bg-gradient-to-r from-slate-900/5 to-slate-900/0
                               border border-white/60 text-slate-700"
                  >
                    {b.status}
                  </span>
                </div>

                <div className="mt-3 text-sm text-slate-700 space-y-1">
                  <div>
                    <span className="font-extrabold text-slate-900">When:</span>{" "}
                    {new Date(b.scheduledAt).toLocaleString()}
                  </div>
                  {b.addressText ? (
                    <div>
                      <span className="font-extrabold text-slate-900">Address:</span> {b.addressText}
                    </div>
                  ) : null}
                  {b.note ? (
                    <div>
                      <span className="font-extrabold text-slate-900">Note:</span> {b.note}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  );
}