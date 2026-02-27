"use client";

import { Menu } from "lucide-react";
import type { AppNotification, ProviderMe } from "@/lib/types/provider";
import NotificationBell from "../_components/modals/BaseModal";

export default function ProviderTopbarClient({
  me,
  notifications,
  unread,
  onOpenSidebar,
}: {
  me: ProviderMe | null;
  notifications: AppNotification[];
  unread: number;
  onOpenSidebar?: () => void;
}) {
  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile hamburger */}
        {onOpenSidebar ? (
          <button
            onClick={onOpenSidebar}
            className="lg:hidden h-11 w-11 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition grid place-items-center"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-slate-800" />
          </button>
        ) : null}

        <div className="min-w-0">
          <div className="text-base sm:text-lg font-semibold text-slate-900 truncate">
            Welcome, {me?.firstName || "Provider"} !!!
          </div>
          <div className="text-xs sm:text-sm text-slate-500 truncate">
            Manage bookings, update statuses, and track ratings.
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell unread={unread} notifications={notifications} />
      </div>
    </div>
  );
}