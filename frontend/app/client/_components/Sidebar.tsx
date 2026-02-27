"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home,  ClipboardList, LogOut, User } from "lucide-react";
import GlassCard from "./ui/GlassCard";
import { cn } from "./ui/cn";
import Button from "./ui/Button";
import { logoutAction } from "@/lib/actions/auth-actions";

type SidebarUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: "client" | "provider" | "admin";
  avatarUrl?: string;
};

export default function Sidebar({ user }: { user?: SidebarUser | null }) {
  const pathname = usePathname();

  const items = [
  { href: "/client/dashboard", label: "Home", icon: Home },
  { href: "/client/dashboard/bookings", label: "Bookings", icon: ClipboardList },
  { href: "/client/dashboard/favourites", label: "Favourites", icon: Heart },
  { href: "/client/dashboard/profile", label: "Profile", icon: User },
  ];

  async function onLogout() {
    await logoutAction();
    window.location.href = "/login";
  }

  const displayName = user?.firstName?.trim() || "Client";

  return (
    <GlassCard className="p-5 sticky top-6">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl overflow-hidden border border-white/35 bg-white/60">
          <Image
            src="/sajilo_sewa_logo.png"
            alt="Sajilo Sewa"
            width={44}
            height={44}
            className="h-11 w-11 object-cover"
          />
        </div>

        <div className="min-w-0">
          <div className="font-extrabold text-slate-900 leading-tight">Sajilo Sewa</div>
          <div className="text-xs text-slate-500 truncate">{displayName}</div>
        </div>
      </div>
      <div className="mt-5 space-y-1">
        {items.map((it) => {
          const active = pathname === it.href;
          const Icon = it.icon;

          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
                active
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-[0_12px_35px_rgba(37,99,235,0.25)]"
                  : "text-slate-700 hover:bg-white/60"
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-white" : "text-slate-500")} />
              <span>{it.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 pt-5 border-t border-white/35">
        <Button variant="danger" className="w-full" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </GlassCard>
  );
}
