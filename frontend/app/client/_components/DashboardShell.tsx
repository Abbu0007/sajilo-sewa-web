import { ReactNode } from "react";
import { cn } from "./ui/cn";

export type DashboardUser = {
  id?: string;
  email: string;
  role: "client" | "provider" | "admin";
  firstName?: string;
  lastName?: string;
  profession?: string;
  serviceSlug?: string;
  avatarUrl?: string;
};

export default function DashboardShell({
  sidebar,
  topbar,
  footer,
  children,
  user,
}: {
  sidebar: ReactNode;
  topbar: ReactNode;
  footer: ReactNode;
  children: ReactNode;
  user?: DashboardUser | null;
}) {
  return (
    <div className="min-h-screen w-full bg-[radial-gradient(1200px_600px_at_30%_10%,rgba(59,130,246,0.20),transparent_60%),radial-gradient(900px_500px_at_80%_20%,rgba(14,165,233,0.12),transparent_55%)]">
      <div className="min-h-screen w-full">
        <div className="flex min-h-screen w-full">
          <aside className="hidden lg:block w-[290px] p-6">{sidebar}</aside>

          <main className="flex-1 min-w-0">
            <div className={cn("sticky top-0 z-40 px-4 sm:px-6 pt-4")}>
              {topbar}
            </div>

            <div className="px-4 sm:px-6 py-6 w-full">
              <div className="mx-auto w-full max-w-[1280px]">{children}</div>
            </div>

            <div className="px-4 sm:px-6 pb-6">
              <div className="mx-auto w-full max-w-[1280px]">{footer}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
