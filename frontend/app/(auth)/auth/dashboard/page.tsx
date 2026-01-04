import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Auth Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">
          Dummy page after login (Sprint 1 requirement)
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            href="/"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Home
          </Link>

          <Link
            href="/login"
            className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-white"
          >
            Logout (dummy)
          </Link>
        </div>
      </div>
    </main>
  );
}
