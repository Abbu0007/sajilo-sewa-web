"use client";

import Image from "next/image";
import { Heart, CalendarCheck, Info } from "lucide-react";
import { cn } from "./ui/cn";
import type { ProviderItem } from "@/lib/actions/client-actions";

export default function ProviderCard({
  provider,
  isFavourite,
  onOpen,
  onBook,
  onToggleFavourite,
}: {
  provider: ProviderItem;
  isFavourite: boolean;
  onOpen: () => void;
  onBook: () => void;
  onToggleFavourite: () => void;
}) {
  const initials =
    `${provider.firstName?.[0] ?? ""}${provider.lastName?.[0] ?? ""}`.trim().toUpperCase() || "U";

  return (
    <div
      className={cn(
        "group relative w-full text-left rounded-3xl overflow-hidden",
        "bg-white/70 backdrop-blur border border-white/35",
        "shadow-[0_18px_60px_rgba(15,23,42,0.08)]",
        "transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(15,23,42,0.12)]"
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(900px_300px_at_20%_0%,rgba(59,130,246,0.18),transparent_60%)]" />

      <div className="relative p-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-12 w-12 rounded-2xl overflow-hidden border border-white/35 bg-white/60 grid place-items-center">
              {provider.avatarUrl ? (
                <Image
                  src={provider.avatarUrl}
                  alt="avatar"
                  width={48}
                  height={48}
                  className="h-12 w-12 object-cover"
                />
              ) : (
                <span className="font-extrabold text-slate-700">{initials}</span>
              )}
            </div>

            <div className="min-w-0">
              <div className="font-extrabold text-slate-900 truncate">
                {provider.firstName} {provider.lastName}
              </div>
              <div className="text-xs text-slate-600 truncate">
                {provider.profession ?? "Professional"} • {provider.serviceSlug ?? "service"}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavourite();
            }}
            className={cn(
              "h-10 w-10 rounded-2xl grid place-items-center border transition",
              "bg-white/60 hover:bg-white",
              "border-white/35"
            )}
            aria-label="toggle favourite"
          >
            <Heart
              className={cn(
                "h-5 w-5 transition",
                isFavourite ? "fill-red-500 text-red-500" : "text-slate-700"
              )}
            />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onOpen}
            className="h-11 rounded-2xl border bg-white/70 hover:bg-white px-4 text-sm font-extrabold text-slate-900 transition inline-flex items-center justify-center gap-2"
          >
            <Info className="h-4 w-4" />
            View Details
          </button>

          <button
            type="button"
            onClick={onBook}
            className="h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 px-4 text-sm font-extrabold text-white transition shadow-[0_16px_50px_rgba(37,99,235,0.25)] inline-flex items-center justify-center gap-2"
          >
            <CalendarCheck className="h-4 w-4" />
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}