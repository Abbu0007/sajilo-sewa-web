import Link from "next/link";
import { adminGetUser } from "@/lib/actions/admin-users.actions";
import EditUserFormClient from "./EditUserFormClient";

export default async function AdminUserEditPage(props: { params: any }) {
  const params = await Promise.resolve(props.params);
  const id = params?.id as string;

  try {
    if (!id) throw new Error("Missing user id in route params");

    const data = await adminGetUser(id);
    const u = data.user;

    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-white/90 text-sm font-semibold">Sajilo Sewa • Admin</div>
                <h2 className="text-white text-xl sm:text-2xl font-extrabold tracking-tight">
                  Edit User
                </h2>
                <p className="text-white/80 text-sm">
                  Edit details based on role (client/provider). Email & phone are locked.
                </p>
              </div>

              <Link
                href={`/admin/dashboard/users/${id}`}
                className="rounded-2xl bg-white/95 px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-white/40 hover:bg-white"
              >
                Back
              </Link>
            </div>
          </div>

          <div className="p-6">
            <EditUserFormClient
              id={id}
              user={{
                firstName: u.firstName,
                lastName: u.lastName,
                role: u.role,
                profession: u.profession,
                serviceSlug: u.serviceSlug,
                avatarUrl: u.avatarUrl,
                email: u.email,
                phone: u.phone,
              }}
            />
          </div>
        </div>
      </div>
    );
  } catch (e: any) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-rose-200">
          <h2 className="text-lg font-semibold text-rose-700">Failed to load edit page</h2>
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