"use client";

import { ReactNode, useState } from "react";
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
  const [mobileOpen, setMobileOpen] = useState(false);

 
  const topbarNode =
    typeof topbar === "object" && (topbar as any)?.type
      ? (topbar as any)?.props?.onOpenSidebar
        ? topbar
        :
          (require("react") as typeof import("react")).cloneElement(topbar as any, {
            onOpenSidebar: () => setMobileOpen(true),
          })
      : topbar;

  return (
    <div
      className="
        min-h-screen w-full
        bg-[radial-gradient(1200px_600px_at_30%_10%,rgba(59,130,246,0.20),transparent_60%),radial-gradient(900px_500px_at_80%_20%,rgba(14,165,233,0.12),transparent_55%)]
      "
    >
      <div className="min-h-screen w-full">
        <div className="flex min-h-screen w-full">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-[290px] p-6">{sidebar}</aside>

          {/* Mobile Sidebar Drawer */}
          {mobileOpen ? (
            <div className="fixed inset-0 z-[200] lg:hidden">
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                onClick={() => setMobileOpen(false)}
              />
              <div className="absolute left-0 top-0 h-full w-[86vw] max-w-[320px] p-3">
                <div
                  className="h-full"
                  onClick={(e) => {
                    
                    e.stopPropagation();
                  }}
                >
                  
                  <div onClick={() => setMobileOpen(false)}>{sidebar}</div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Topbar */}
            <div className={cn("sticky top-0 z-40 px-4 sm:px-6 pt-4")}>{topbarNode}</div>

            {/* Page Content */}
            <div className="px-4 sm:px-6 py-6 w-full">
              <div className="mx-auto w-full max-w-[1280px]">{children}</div>
            </div>

            {/* Footer */}
            <div className="px-4 sm:px-6 pb-6">
              <div className="mx-auto w-full max-w-[1280px]">{footer}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}