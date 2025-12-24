import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-600 text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-2xl font-bold">Sajilo Sewa</h1>
            <p className="text-sm text-slate-600">
              House Service Booking System — Sprint 1
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border bg-slate-50 p-5">
            <h2 className="text-lg font-semibold">Frontend Auth Design</h2>
            <p className="mt-1 text-sm text-slate-600">
              Login and Register pages with Zod validation and component
              separation.
            </p>

            <div className="mt-4 flex gap-3">
              <Link
                href="/login"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Go to Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg border px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-white"
              >
                Go to Register
              </Link>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <h2 className="text-lg font-semibold">Dummy Dashboard</h2>
            <p className="mt-1 text-sm text-slate-600">
              Sprint requirement: a page after login at <code>/auth/dashboard</code>.
            </p>

            <div className="mt-4">
              <Link
                href="/auth/dashboard"
                className="inline-block rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                Open Dashboard
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-8 text-xs text-slate-500">
          Note: This is a dummy home page for Sprint 1 routing requirement.
        </p>
      </div>
    </main>
  );
}
