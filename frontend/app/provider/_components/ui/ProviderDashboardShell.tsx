"use client";

import { ReactNode, useState } from "react";
import ProviderSidebar from "./ProviderSidebar";
import ProviderTopbarClient from "../ProviderTopbarClient";
import type { AppNotification, ProviderMe } from "@/lib/types/provider";

export default function ProviderDashboardShell({
  children,
  me,
  notifications,
  unread,
}: {
  children: ReactNode;
  me: ProviderMe | null;
  notifications: AppNotification[];
  unread: number;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6F8FF]">
      <div className="flex min-h-screen w-full">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-[290px] p-6">
          <ProviderSidebar />
        </aside>

        {/* Mobile sidebar drawer */}
        {mobileOpen ? (
          <div className="fixed inset-0 z-[200] lg:hidden">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-[86vw] max-w-[320px] p-3">
              <div className="h-full" onClick={(e) => e.stopPropagation()}>
                {/* Close drawer when user clicks any link inside sidebar */}
                <div onClick={() => setMobileOpen(false)}>
                  <ProviderSidebar />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Main */}
        <main className="flex-1 min-w-0">
          {/* Topbar */}
          <div className="sticky top-0 z-40 px-4 sm:px-6 pt-4">
            <ProviderTopbarClient
              me={me}
              notifications={notifications}
              unread={unread}
              onOpenSidebar={() => setMobileOpen(true)}
            />
          </div>

          {/* Content (full width, no max container) */}
          <div className="px-4 sm:px-6 py-6 w-full">
            <div className="w-full">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}