import Link from "next/link";
import { adminGetUser } from "@/lib/actions/admin-users.actions";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function fmt1(n: any) {
  const x = Number(n ?? 0);
  if (!Number.isFinite(x)) return "0.0";
  return x.toFixed(1);
}

function initials(first?: string, last?: string) {
  const a = String(first ?? "").trim().charAt(0);
  const b = String(last ?? "").trim().charAt(0);
  const v = `${a}${b}`.toUpperCase();
  return v || "U";
}

export default async function AdminUserViewPage(props: { params: any }) {
  const params = await Promise.resolve(props.params);
  const id = params?.id as string;

  try {
    if (!id) throw new Error("Missing user id in route params");

    const data = await adminGetUser(id);
    const u = data.user;

    const fullName = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || "—";
    const role = String(u.role ?? "");
    const isProvider = role === "provider";
    const isClient = role === "client";

    const ratingAvg = fmt1(u.ratingAvg);
    const ratingCount = Number(u.ratingCount ?? 0);
    const completed = Number(u.completedBookings ?? 0);

    const backHref = isProvider
      ? "/admin/dashboard/users?role=provider"
      : "/admin/dashboard/users?role=client";

    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-white/90 text-sm font-semibold">Sajilo Sewa • Admin</div>
                <h2 className="text-white text-xl sm:text-2xl font-extrabold tracking-tight">
                  User Details
                </h2>
                <p className="text-white/80 text-sm">
                  Full profile, rating stats, and service info 
                </p>
              </div>

              <Link
                href={backHref}
                className="rounded-2xl bg-white/95 px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-white/40 hover:bg-white"
              >
                Back
              </Link>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200 flex-shrink-0">
                  {u.avatarUrl ? (
                    <img src={u.avatarUrl} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg font-extrabold text-slate-600">
                      {initials(u.firstName, u.lastName)}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="text-xl font-extrabold text-slate-900 truncate">{fullName}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1",
                        isClient
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                          : isProvider
                          ? "bg-indigo-50 text-indigo-700 ring-indigo-200"
                          : "bg-slate-50 text-slate-700 ring-slate-200"
                      )}
                    >
                      {role || "—"}
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200 px-3 py-1 text-xs font-extrabold">
                      ⭐ {ratingAvg}
                      <span className="font-bold text-amber-600">({ratingCount})</span>
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-3 py-1 text-xs font-extrabold">
                      ✅ {completed} completed
                    </span>
                  </div>

                  <div className="mt-2 text-sm text-slate-600 truncate">{u.email || "—"}</div>
                </div>
              </div>

              <div className="flex gap-2 sm:justify-end">
                <Link
                  href={`/admin/dashboard/users/${id}/edit`}
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-indigo-600 px-5 text-sm font-extrabold text-white hover:bg-indigo-700 ring-1 ring-black/5"
                >
                  Edit User
                </Link>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="text-xs font-bold text-slate-500">Phone</div>
                <div className="mt-1 text-sm font-extrabold text-slate-900">{u.phone || "—"}</div>
              </div>

              <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="text-xs font-bold text-slate-500">Role</div>
                <div className="mt-1 text-sm font-extrabold text-slate-900">{role || "—"}</div>
              </div>

              <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="text-xs font-bold text-slate-500">Profession</div>
                <div className="mt-1 text-sm font-extrabold text-slate-900">
                  {isProvider ? u.profession || "—" : "—"}
                </div>
              </div>

              <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="text-xs font-bold text-slate-500">Service</div>
                <div className="mt-1 text-sm font-extrabold text-slate-900">
                  {isProvider ? u.serviceSlug || "—" : "—"}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-3xl bg-white ring-1 ring-slate-200 overflow-hidden">
              <div className="px-5 py-4 bg-slate-50 border-b border-slate-200">
                <div className="text-sm font-extrabold text-slate-900">Performance</div>
                <div className="text-xs text-slate-500">
                  Stats are computed from ratings and completed bookings.
                </div>
              </div>

              <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="text-xs font-bold text-slate-500">Avg rating</div>
                  <div className="mt-1 text-lg font-extrabold text-slate-900">{ratingAvg}</div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="text-xs font-bold text-slate-500">Total ratings</div>
                  <div className="mt-1 text-lg font-extrabold text-slate-900">{ratingCount}</div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="text-xs font-bold text-slate-500">Completed</div>
                  <div className="mt-1 text-lg font-extrabold text-slate-900">{completed}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-xs text-slate-500">
                User ID: <span className="font-semibold text-slate-700">{u.id || id}</span>
              </div>

              <div className="flex gap-2 justify-end">
                <Link
                  href={backHref}
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-slate-100 px-5 text-sm font-semibold text-slate-800 hover:bg-slate-200"
                >
                  Back to list
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (e: any) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-rose-200">
          <h2 className="text-lg font-semibold text-rose-700">Failed to load user</h2>
          <p className="mt-2 text-sm text-slate-700">{e?.message ?? "Unknown error"}</p>
          <Link
            href="/admin/dashboard/users?role=client"
            className="mt-4 inline-flex rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Back to Users
          </Link>
        </div>
      </div>
    );
  }
}