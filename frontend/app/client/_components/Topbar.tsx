"use client";

import { useMemo } from "react";
import GlassCard from "./ui/GlassCard";
import NotificationBell from "./NotificationBell";

export default function Topbar({ firstName }: { firstName?: string }) {
  const greeting = useMemo(() => {
    const name = firstName?.trim() ? firstName.trim() : "there";
    return `Welcome, ${name} !!!`;
  }, [firstName]);

  return (
    <GlassCard className="px-5 py-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm sm:text-base font-extrabold text-slate-900">
            {greeting}
          </div>
          <div className="text-xs sm:text-sm text-slate-600">
            Find services, book providers, track requests.
          </div>
        </div>

        <NotificationBell />
      </div>
    </GlassCard>
  );
}
