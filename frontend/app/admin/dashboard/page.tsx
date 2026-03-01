import Link from "next/link";

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="text-sm font-medium text-slate-600">Quick Action</div>
          <div className="mt-2 text-xl font-semibold text-slate-900">Manage Users</div>
          <p className="mt-1 text-sm text-slate-500">
            View clients and service providers, edit profiles, or remove users.
          </p>
          <Link
            href="/admin/dashboard/users?role=client"
            className="mt-4 inline-flex rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Open Users
          </Link>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="text-sm font-medium text-slate-600">Create</div>
          <div className="mt-2 text-xl font-semibold text-slate-900">Add New User</div>
          <p className="mt-1 text-sm text-slate-500">
            Create a new client or provider account (supports avatar upload).
          </p>
          <Link
            href="/admin/dashboard/users/create"
            className="mt-4 inline-flex rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Create User
          </Link>
        </div>
        
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="text-sm font-medium text-slate-600">Bookings</div>
          <div className="mt-2 text-xl font-semibold text-slate-900">View Bookings</div>
          <p className="mt-1 text-sm text-slate-500"> Monitor bookings created in the app.
          </p>
          <Link href="/admin/dashboard/bookings" className="mt-4 inline-flex rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
          Open Bookings
          </Link>
            </div>
        </div>

      {/* Big CTA */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Sajilo Sewa Admin</h2>
            <p className="text-sm text-slate-500">
              Keep the platform clean and organized by managing user accounts.
            </p>
          </div>
          <Link
            href="/admin/dashboard/users?role=provider"
            className="inline-flex justify-center rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95"
          >
            View Service Providers
          </Link>
        </div>
      </div>
    </div>
  );
}
