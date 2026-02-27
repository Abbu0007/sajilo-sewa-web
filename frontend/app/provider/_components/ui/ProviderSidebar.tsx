"use client";
import Image from "next/image"; 
import { logoutAction } from "@/lib/actions/auth-actions";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/provider/dashboard", label: "Home" },
  { href: "/provider/dashboard/bookings", label: "Bookings" },
  { href: "/provider/dashboard/profile", label: "Profile" },
];

export default function ProviderSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-4 h-fit sticky top-6">
    <div className="flex items-center gap-3 pb-4 border-b">
      <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
      <Image
        src="/sajilo_sewa_logo.png"
        alt="Sajilo Sewa Logo"
        width={40}
        height={40}
        className="object-contain"
        priority
      />
      </div>
      <div>
        <div className="font-semibold text-slate-900">Sajilo Sewa</div>
        <div className="text-xs text-slate-500">Provider</div>
      </div>
    </div>

      <nav className="pt-4 space-y-2">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "block rounded-xl px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-blue-600 text-white"
                  : "text-slate-700 hover:bg-slate-100",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="pt-6">
        <button
          className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-4 py-2 text-sm font-semibold text-white shadow"
          onClick={async () => {
            await logoutAction();
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}