"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { logoutAction } from "@/lib/actions/auth-actions";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const isUsers = pathname?.includes("/admin/dashboard/users");
  const isOverview = pathname === "/admin/dashboard";
  const isBookings = pathname?.includes("/admin/dashboard/bookings");

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-600">
        <div className="w-full px-4 py-6 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-1 text-sm font-semibold text-white ring-1 ring-white/20">
                <span className="inline-block h-2 w-2 rounded-full bg-white/90" />
                Sajilo Sewa
              </div>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm text-white/80">
                Manage users, providers, and system operations.
              </p>
            </div>

            <button
              onClick={() =>
                startTransition(async () => {
                  await logoutAction();
                  router.push("/login");
                  router.refresh();
                })
              }
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-white/40 hover:bg-white/90 disabled:opacity-60"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-rose-500" />
              {pending ? "Logging out..." : "Logout"}
            </button>
          </div>

          {/* ================= TABS ================= */}
          <div className="mt-6 flex items-center gap-2">
            <Link
              href="/admin/dashboard"
              className={cn(
                "rounded-2xl px-4 py-2 text-sm font-semibold ring-1 transition",
                isOverview
                  ? "bg-white text-slate-900 ring-white/60"
                  : "bg-white/10 text-white ring-white/20 hover:bg-white/15"
              )}
            >
              Overview
            </Link>

            <Link
              href="/admin/dashboard/users?role=client"
              className={cn(
                "rounded-2xl px-4 py-2 text-sm font-semibold ring-1 transition",
                isUsers
                  ? "bg-white text-slate-900 ring-white/60"
                  : "bg-white/10 text-white ring-white/20 hover:bg-white/15"
              )}
            >
              Users
            </Link>

            <Link
              href="/admin/dashboard/bookings"
              className={cn(
                "rounded-2xl px-4 py-2 text-sm font-semibold ring-1 transition",
                isBookings
                  ? "bg-white text-slate-900 ring-white/60"
                  : "bg-white/10 text-white ring-white/20 hover:bg-white/15"
              )}
            >
              Bookings
            </Link>
          </div>
        </div>
      </div>

      
      <main className="w-full flex-1 px-4 py-6 sm:px-6">
        {children}
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          {/* Left */}
          <div className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">© {new Date().getFullYear()} Sajilo Sewa</span>
            <span className="mx-2 text-slate-300">•</span>
            Admin Panel
          </div>

          {/* Center */}
          <div className="text-xs text-slate-500">
            Built for efficient home-service management
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200">
              v1.0.0
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              Local
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
