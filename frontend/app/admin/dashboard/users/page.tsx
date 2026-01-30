import { adminListUsers } from "@/lib/actions/admin-users.actions";
import UsersTableClient from "./_components/UsersTableClient";

type SP = { role?: "client" | "provider"; q?: string };

export default async function AdminUsersPage(props: { searchParams: any }) {
  // ✅ Next.js 16: searchParams can be Promise
  const sp: SP = await Promise.resolve(props.searchParams);

  const role = sp.role ?? "client";
  const q = sp.q ?? "";

  const data = await adminListUsers();
  const users: any[] = data.users || [];

  // We do filtering in client component too (for instant UI update),
  // but server pre-filter keeps the initial page clean.
  return (
    <UsersTableClient
      initialUsers={users}
      initialRole={role}
      initialQuery={q}
    />
  );
}
