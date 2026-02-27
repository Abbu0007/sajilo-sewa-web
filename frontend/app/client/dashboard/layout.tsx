import DashboardShell from "../_components/DashboardShell";
import { cookies } from "next/headers";
import Sidebar from "../_components/Sidebar";
import Topbar from "../_components/Topbar";
import Footer from "../_components/Footer";

type CookieUser = {
  id?: string;
  email: string;
  role: "client" | "provider" | "admin";
  firstName?: string;
  lastName?: string;
  profession?: string;
  avatarUrl?: string;
  serviceSlug?: string;
};

async function getUserFromCookie(): Promise<CookieUser | null> {
  try {
    const store = await cookies();
    const raw = store.get("ss_user")?.value;
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed?.email || !parsed?.role) return null;

    return parsed as CookieUser;
  } catch {
    return null;
  }
}

export default async function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromCookie();

  return (
    <DashboardShell
      user={user}
      sidebar={<Sidebar user={user} />}
      topbar={<Topbar firstName={user?.firstName} />}
      footer={<Footer />}
    >
      {children}
    </DashboardShell>
    
  );
}
