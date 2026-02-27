import ProviderStatsRow from "../_components/ui/ProviderStatsRow";
import ProviderBookingCard from "../_components/ui/ProviderBookingCard";
import BookingDetailsClient from "./_ui/booking-details-client";
import {
  providerGetBookings,
  providerGetMe,
  providerGetProfile,
} from "@/lib/actions/provider-actions";

export default async function ProviderDashboardHome() {
  const me = await providerGetMe().catch(() => null);
  const profile = await providerGetProfile().catch(() => null);

  const all = await providerGetBookings("all").catch(() => []);
  const pending = all.filter((b) => b.status === "pending").length;
  const confirmed = all.filter((b) => b.status === "confirmed").length;
  const inProgress = all.filter((b) => b.status === "in_progress").length;
  const completed = all.filter((b) => b.status === "completed").length;

  const pendingList = await providerGetBookings("pending").catch(() => []);
  const upcoming = all
    .filter((b) => b.status === "confirmed" || b.status === "in_progress")
    .slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 p-10 text-white shadow-xl">
        <div className="text-4xl font-extrabold leading-tight">
          Manage Your Service Bookings <br /> in Minutes
        </div>
        <div className="mt-3 max-w-2xl text-white/80">
          Accept requests, update status, and keep clients happy. Ratings are
          requested automatically after completion.
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href="/provider/dashboard/bookings?status=pending"
            className="rounded-2xl bg-white/15 px-5 py-2 font-semibold hover:bg-white/20"
          >
            View Pending
          </a>
          <a
            href="/provider/dashboard/bookings?status=in_progress"
            className="rounded-2xl bg-white/15 px-5 py-2 font-semibold hover:bg-white/20"
          >
            In Progress
          </a>
          <a
            href="/provider/dashboard/profile"
            className="rounded-2xl bg-white/15 px-5 py-2 font-semibold hover:bg-white/20"
          >
            Profile
          </a>
        </div>
      </div>

      {/* Stats */}
      <ProviderStatsRow
        pending={pending}
        confirmed={confirmed}
        inProgress={inProgress}
        completed={completed}
      />

      {/* Pending requests */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6">
        <div className="text-lg font-semibold text-slate-900">
          New Booking Requests
        </div>
        <div className="text-sm text-slate-500">
          Accept or reject pending requests.
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {pendingList.length === 0 ? (
            <div className="text-sm text-slate-500">No pending requests.</div>
          ) : (
            pendingList.slice(0, 6).map((b) => (
              <BookingDetailsClient key={b.id} booking={b}>
                <ProviderBookingCard booking={b} />
              </BookingDetailsClient>
            ))
          )}
        </div>
      </div>

      {/* Upcoming */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6">
        <div className="text-lg font-semibold text-slate-900">Upcoming</div>
        <div className="text-sm text-slate-500">
          Your next confirmed / in-progress bookings.
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {upcoming.length === 0 ? (
            <div className="text-sm text-slate-500">No upcoming bookings.</div>
          ) : (
            upcoming.map((b) => (
              <BookingDetailsClient key={b.id} booking={b}>
                <ProviderBookingCard booking={b} />
              </BookingDetailsClient>
            ))
          )}
        </div>
      </div>

      {/* Rating summary */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6">
        <div className="text-lg font-semibold text-slate-900">
          Rating Summary
        </div>
        <div className="mt-3 flex gap-6">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-600">Avg Rating</div>
            <div className="text-3xl font-extrabold text-slate-900">
              {(profile?.ratingAvg ?? 0).toFixed(1)}
            </div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-600">
              Completed Jobs
            </div>
            <div className="text-3xl font-extrabold text-slate-900">
              {profile?.completedJobs ?? 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}