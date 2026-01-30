import Link from "next/link";

export default function AdminBookingsPage() {
  return (
    <div className="space-y-6">
      {/* Title row */}
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Bookings</h2>
            <p className="text-sm text-slate-500">
              This page will show bookings created in the app 
            </p>
          </div>

          <Link
            href="/admin/dashboard"
            className="inline-flex justify-center rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-200"
          >
            Back to Overview
          </Link>
        </div>
      </div>

      {/* Filters (dummy UI) */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="text-sm font-medium text-slate-600">Status</div>
          <div className="mt-3 flex gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              Active
            </span>
            <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
              Completed
            </span>
            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">
              Cancelled
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            This are the signs of the Status
          </p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="text-sm font-medium text-slate-600">Search</div>
          <div className="mt-3 flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
            <span className="text-slate-500">🔎</span>
            <input
              placeholder="Search client / provider..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Example: “Plumber”, “Abhishek”, “Kathmandu”.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="text-sm font-medium text-slate-600">Quick Action</div>
          <div className="mt-2 text-xl font-semibold text-slate-900">Export</div>
          <p className="mt-1 text-sm text-slate-500">
            Export bookings list (future feature).
          </p>
          <button
            disabled
            className="mt-4 inline-flex rounded-2xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500"
          >
            Export (Coming Soon)
          </button>
        </div>
      </div>

      {/* Dummy bookings table */}
      <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="text-sm font-semibold text-slate-900">Recent Bookings</div>
          <div className="text-xs text-slate-500">
            Dummy rows for now
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-6 py-3 font-semibold">Client</th>
                <th className="px-6 py-3 font-semibold">Service</th>
                <th className="px-6 py-3 font-semibold">Provider</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {[
                { client: "Abhishek", service: "Electrician", provider: "Bhusan", status: "Active", date: "Today" },
                { client: "Shraddha", service: "Cleaning", provider: "—", status: "Pending", date: "Yesterday" },
                { client: "Nripesh", service: "Carpenter", provider: "Sita", status: "Completed", date: "Oct 25" },
              ].map((b, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60">
                  <td className="px-6 py-4 font-semibold text-slate-900">{b.client}</td>
                  <td className="px-6 py-4 text-slate-700">{b.service}</td>
                  <td className="px-6 py-4 text-slate-700">{b.provider}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200">
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{b.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      disabled
                      className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500"
                    >
                      View (Soon)
                    </button>
                  </td>
                </tr>
              ))}

              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                  Booking CRUD will be added in the next sprint .
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
