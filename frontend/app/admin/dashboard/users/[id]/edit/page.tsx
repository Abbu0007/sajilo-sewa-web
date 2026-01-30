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
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Edit User</h2>
              <p className="text-sm text-slate-500">
                Editable: name, role, profession, avatar only.
              </p>
            </div>
            <Link
              href={`/admin/dashboard/users/${id}`}
              className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-200"
            >
              Back
            </Link>
          </div>

          <EditUserFormClient
            id={id}
            user={{
              firstName: u.firstName,
              lastName: u.lastName,
              role: u.role,
              profession: u.profession,
            }}
          />
        </div>
      </div>
    );
  } catch (e: any) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-rose-200">
          <h2 className="text-lg font-semibold text-rose-700">Failed to load edit page</h2>
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
