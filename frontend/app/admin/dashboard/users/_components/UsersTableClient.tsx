"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { adminDeleteUser, adminListUsers } from "@/lib/actions/admin-users.actions";

type UserRow = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role: "client" | "provider" | "admin";
  profession?: string;
  serviceSlug?: string;
  avatarUrl?: string;
  ratingAvg?: number;
  ratingCount?: number;
  completedBookings?: number;
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "U";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

function fmt1(n: any) {
  const x = Number(n ?? 0);
  if (!Number.isFinite(x)) return "0.0";
  return x.toFixed(1);
}

export default function UsersTableClient({
  initialUsers,
  initialRole,
  initialQuery,
}: {
  initialUsers: UserRow[];
  initialRole: "client" | "provider";
  initialQuery: string;
}) {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [role, setRole] = useState<"client" | "provider">(initialRole);
  const [query, setQuery] = useState(initialQuery);

  const [pending, startTransition] = useTransition();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [target, setTarget] = useState<UserRow | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return users
      .filter((u) => u.role !== "admin")
      .filter((u) => u.role === role)
      .filter((u) => {
        if (!q) return true;
        const fullName = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
        return (
          fullName.toLowerCase().includes(q) ||
          (u.email ?? "").toLowerCase().includes(q) ||
          (u.phone ?? "").toLowerCase().includes(q) ||
          (u.profession ?? "").toLowerCase().includes(q) ||
          (u.serviceSlug ?? "").toLowerCase().includes(q)
        );
      });
  }, [users, role, query]);

  function openDelete(u: UserRow) {
    setTarget(u);
    setConfirmOpen(true);
  }

  async function doDelete() {
    if (!target) return;

    const id = target.id;
    setConfirmOpen(false);

    setUsers((prev) => prev.filter((u) => u.id !== id));

    startTransition(async () => {
      try {
        await adminDeleteUser(id);
        const data = await adminListUsers();
        setUsers(data.users || []);
      } catch (e) {
        const data = await adminListUsers();
        setUsers(data.users || []);
        alert("Delete failed. Refreshed list.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-white/90 text-sm font-semibold">Sajilo Sewa • Admin</div>
              <h2 className="text-white text-xl sm:text-2xl font-bold tracking-tight">User Management</h2>
              <p className="text-white/80 text-sm">
                Filter clients and service providers, then view / edit / delete.
              </p>
            </div>

            <Link
              href="/admin/dashboard/users/create"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-white/40 hover:bg-white/90"
            >
              + Create User
            </Link>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setRole("client")}
                className={cn(
                  "rounded-2xl px-4 py-2 text-sm font-semibold ring-1 transition",
                  role === "client"
                    ? "bg-white text-slate-900 ring-white/60"
                    : "bg-white/10 text-white ring-white/20 hover:bg-white/15"
                )}
              >
                Clients
              </button>

              <button
                onClick={() => setRole("provider")}
                className={cn(
                  "rounded-2xl px-4 py-2 text-sm font-semibold ring-1 transition",
                  role === "provider"
                    ? "bg-white text-slate-900 ring-white/60"
                    : "bg-white/10 text-white ring-white/20 hover:bg-white/15"
                )}
              >
                Service Providers
              </button>
            </div>

            <div className="flex w-full gap-2 sm:w-[420px]">
              <div className="flex w-full items-center gap-2 rounded-2xl bg-white/95 px-3 py-2 ring-1 ring-white/40">
                <span className="text-slate-500">🔎</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, email, phone..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>
              <button
                onClick={() => setQuery("")}
                className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/15"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <div>
              Showing <span className="font-semibold">{filtered.length}</span>{" "}
              {role === "client" ? "clients" : "providers"}
            </div>
            <div className="text-xs text-slate-500">Actions are instant (no reload needed).</div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-900">
            {role === "client" ? "Clients" : "Service Providers"}
          </div>

          <button
            onClick={() =>
              startTransition(async () => {
                const data = await adminListUsers();
                setUsers(data.users || []);
              })
            }
            className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            {pending ? "Refreshing..." : "Refresh list"}
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-500">
            No users found. Try changing role or search query.
          </div>
        ) : (
          <div className="p-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((u) => {
                const fullName = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || "—";
                const rolePill =
                  u.role === "client"
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : "bg-indigo-50 text-indigo-700 ring-indigo-200";

                const ratingAvg = fmt1(u.ratingAvg);
                const ratingCount = Number(u.ratingCount ?? 0);
                const completed = Number(u.completedBookings ?? 0);

                return (
                  <div
                    key={u.id}
                    className="rounded-3xl bg-white ring-1 ring-slate-200 shadow-sm overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-12 w-12 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200 flex-shrink-0">
                            {u.avatarUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={u.avatarUrl} alt="avatar" className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs font-extrabold text-slate-600">
                                {initials(fullName)}
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="font-extrabold text-slate-900 truncate">{fullName}</div>
                            <div className="text-xs text-slate-500 truncate">{u.email || "—"}</div>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1", rolePill)}>
                                {u.role}
                              </span>

                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200 px-3 py-1 text-xs font-extrabold">
                                ⭐ {ratingAvg}
                                <span className="font-bold text-amber-600">({ratingCount})</span>
                              </span>

                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-3 py-1 text-xs font-extrabold">
                                ✅ {completed} completed
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                          <div className="text-[11px] font-bold text-slate-500">Phone</div>
                          <div className="mt-1 text-sm font-extrabold text-slate-900 truncate">
                            {u.phone || "—"}
                          </div>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                          <div className="text-[11px] font-bold text-slate-500">
                            {u.role === "provider" ? "Profession" : "Profession"}
                          </div>
                          <div className="mt-1 text-sm font-extrabold text-slate-900 truncate">
                            {u.role === "provider" ? u.profession || "—" : "—"}
                          </div>
                        </div>

                        {u.role === "provider" ? (
                          <div className="col-span-2 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                            <div className="text-[11px] font-bold text-slate-500">Service</div>
                            <div className="mt-1 text-sm font-extrabold text-slate-900 truncate">
                              {u.serviceSlug || "—"}
                            </div>
                          </div>
                        ) : null}
                      </div>

                      <div className="mt-4 flex justify-end gap-2">
                        <Link
                          href={`/admin/dashboard/users/${u.id}`}
                          className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-200"
                        >
                          View
                        </Link>

                        <Link
                          href={`/admin/dashboard/users/${u.id}/edit`}
                          className="rounded-xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-100"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => openDelete(u)}
                          className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 text-xs text-slate-500">
              {pending ? "Updating..." : "Ready"}
            </div>
          </div>
        )}
      </div>

      {confirmOpen && target && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-lg ring-1 ring-slate-200">
            <div className="text-lg font-semibold text-slate-900">Delete user?</div>
            <p className="mt-2 text-sm text-slate-600">
              This will permanently remove{" "}
              <span className="font-semibold">
                {`${target.firstName ?? ""} ${target.lastName ?? ""}`.trim() || target.email}
              </span>{" "}
              from the database.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setConfirmOpen(false)}
                className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={doDelete}
                className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}