import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminShell from "./_components/AdminShell";

async function getUser() {
  const jar = await cookies();
  const raw = jar.get("ss_user")?.value;
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) redirect("/login");

  if (user.role !== "admin") redirect("/client/dashboard");
  return <AdminShell>{children}</AdminShell>;
}
