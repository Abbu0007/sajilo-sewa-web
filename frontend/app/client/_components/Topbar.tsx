"use client";

import { useMemo } from "react";
import { Menu } from "lucide-react";
import GlassCard from "./ui/GlassCard";
import NotificationBell from "./NotificationBell";

export default function Topbar({
  firstName,
  onOpenSidebar,
}: {
  firstName?: string;
  onOpenSidebar?: () => void;
}) {
  const greeting = useMemo(() => {
    const name = firstName?.trim() ? firstName.trim() : "there";
    return `Welcome, ${name} !!!`;
  }, [firstName]);

  return (
    <GlassCard className="px-5 py-4">
      <div className="flex items-center justify-between gap-3">
        
        {/* Left Side */}
        <div className="flex items-center gap-3 min-w-0">
          {onOpenSidebar ? (
            <button
              onClick={onOpenSidebar}
              className="lg:hidden h-11 w-11 rounded-2xl border border-white/35 bg-white/70 hover:bg-white transition grid place-items-center"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 text-slate-800" />
            </button>
          ) : null}

          <div className="min-w-0">
            <div className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
              {greeting}
            </div>
            <div className="text-xs sm:text-sm text-slate-600 truncate">
              Find services, book providers, track requests.
            </div>
          </div>
        </div>

        {/* Right Side */}
        <NotificationBell />
      </div>
    </GlassCard>
  );
}