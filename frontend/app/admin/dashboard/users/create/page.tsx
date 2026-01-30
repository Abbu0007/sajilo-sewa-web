import Link from "next/link";
import CreateUserFormClient from "./CreateUserFormClient";

export default function AdminCreateUserPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Create User</h2>
            <p className="text-sm text-slate-500">Create a client or service provider.</p>
          </div>
          <Link
            href="/admin/dashboard/users?role=client"
            className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-200"
          >
            Back
          </Link>
        </div>

        <CreateUserFormClient />
      </div>
    </div>
  );
}
