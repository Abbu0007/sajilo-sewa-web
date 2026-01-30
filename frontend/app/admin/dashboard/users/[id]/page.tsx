import Link from "next/link";
import { adminGetUser } from "@/lib/actions/admin-users.actions";

export default async function AdminUserViewPage(props: { params: any }) {
  const params = await Promise.resolve(props.params);
  const id = params?.id as string;

  try {
    if (!id) throw new Error("Missing user id in route params");

    const data = await adminGetUser(id);
    const u = data.user;

    const fullName = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || "—";

    const role = u.role;
    const professionToShow = role === "provider" ? (u.profession || "—") : "—";

    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">User Details</h2>
              <p className="text-sm text-slate-500">
                Shows avatar, full name, role, phone, profession (provider only).
              </p>
            </div>
            <Link
              href="/admin/dashboard/users?role=client"
              className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-200"
            >
              Back
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
              {u.avatarUrl ? (
                <img src={u.avatarUrl} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg font-bold text-slate-500">
                  {(fullName[0] ?? "U").toUpperCase()}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="text-xl font-semibold text-slate-900">{fullName}</div>
              <div className="text-sm text-slate-600">Role: {role}</div>
              <div className="text-sm text-slate-600">Phone: {u.phone || "—"}</div>
              <div className="text-sm text-slate-600">Profession: {professionToShow}</div>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href={`/admin/dashboard/users/${id}/edit`}
              className="inline-flex rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Edit User
            </Link>
          </div>
        </div>
      </div>
    );
  } catch (e: any) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-rose-200">
          <h2 className="text-lg font-semibold text-rose-700">Failed to load user</h2>
          <p className="mt-2 text-sm text-slate-700">{e?.message ?? "Unknown error"}</p>
          <Link
            href="/admin/dashboard/users?role=client"
            className="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Back to Users
          </Link>
        </div>
      </div>
    );
  }
}
