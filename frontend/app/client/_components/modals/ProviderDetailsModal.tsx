"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, Heart, Mail, Phone, CalendarCheck, Star, Briefcase, Wallet } from "lucide-react";
import { cn } from "../ui/cn";
import type { ProviderItem } from "@/lib/actions/client-actions";
import { toUploadsPath } from "@/lib/utils/media";

export default function ProviderDetailsModal({
  open,
  provider,
  isFavourite,
  onToggleFavourite,
  onBook,
  onClose,
}: {
  open: boolean;
  provider: ProviderItem | null;
  isFavourite?: boolean;
  onToggleFavourite?: () => void;
  onBook?: () => void;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const initials = useMemo(() => {
    if (!provider) return "U";
    return (
      `${provider.firstName?.[0] ?? ""}${provider.lastName?.[0] ?? ""}`.trim().toUpperCase() || "U"
    );
  }, [provider]);

  if (!open || !provider) return null;
  if (!mounted) return null;

  const ratingAvg = typeof provider.ratingAvg === "number" ? provider.ratingAvg : 0;
  const ratingCount = typeof provider.ratingCount === "number" ? provider.ratingCount : 0;
  const startingPrice = typeof provider.startingPrice === "number" ? provider.startingPrice : 0;
  const completedJobs = typeof provider.completedJobs === "number" ? provider.completedJobs : 0;

  const showRating = ratingCount > 0 || ratingAvg > 0;
  const showPrice = startingPrice > 0;
  const showJobs = completedJobs > 0;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9998] bg-black/45 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[9999] grid place-items-center p-4">
        <div
          className="w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/20 bg-gradient-to-br from-blue-700 via-blue-800 to-slate-950 text-white shadow-[0_40px_140px_rgba(2,6,23,0.55)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6">
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -left-24 -bottom-24 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />

            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-14 w-14 rounded-2xl overflow-hidden border border-white/25 bg-white/10 grid place-items-center">
                  {provider.avatarUrl ? (
                    <Image
                      src={toUploadsPath(provider.avatarUrl)}
                      alt="avatar"
                      width={56}
                      height={56}
                      className="h-14 w-14 object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="font-extrabold text-white">{initials}</span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="text-xl sm:text-2xl font-extrabold truncate">
                    {provider.firstName} {provider.lastName}
                  </div>
                  <div className="text-sm text-white/80 truncate">
                    {provider.profession ?? "Professional"} • {provider.serviceSlug ?? "service"}
                  </div>

                  {/* ✅ Stats chips */}
                  {(showRating || showJobs || showPrice) && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {showRating && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/12 border border-white/15 px-2.5 py-1 text-[12px] font-extrabold text-white">
                          <Star className="h-4 w-4 text-amber-300" />
                          {ratingAvg.toFixed(1)}
                          {ratingCount > 0 ? (
                            <span className="text-white/85 font-bold">({ratingCount})</span>
                          ) : null}
                        </span>
                      )}

                      {showJobs && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/12 border border-white/15 px-2.5 py-1 text-[12px] font-extrabold text-white">
                          <Briefcase className="h-4 w-4 text-white/80" />
                          {completedJobs} jobs
                        </span>
                      )}

                      {showPrice && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/12 border border-white/15 px-2.5 py-1 text-[12px] font-extrabold text-white">
                          <Wallet className="h-4 w-4 text-white/80" />
                          From Rs. {startingPrice}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onToggleFavourite ? (
                  <button
                    onClick={onToggleFavourite}
                    className="h-10 w-10 rounded-2xl border border-white/20 bg-white/10 hover:bg-white/15 grid place-items-center transition"
                    aria-label="toggle favourite"
                  >
                    <Heart
                      className={cn(
                        "h-5 w-5",
                        isFavourite ? "fill-red-500 text-red-500" : "text-white"
                      )}
                    />
                  </button>
                ) : null}

                <button
                  onClick={onClose}
                  className="h-10 w-10 rounded-2xl border border-white/20 bg-white/10 hover:bg-white/15 grid place-items-center transition"
                  aria-label="close"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="bg-white/10 border-t border-white/15 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <div className="text-xs text-white/70 font-semibold flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone
                </div>
                <div className="mt-1 text-white font-extrabold">
                  {provider.phone ?? "Not provided"}
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <div className="text-xs text-white/70 font-semibold flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
                <div className="mt-1 text-white font-extrabold break-all">
                  {provider.email ?? "Not provided"}
                </div>
              </div>
            </div>

            {/* Optional info block */}
            <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 p-4">
              <div className="text-xs text-white/70 font-semibold">About</div>
              <div className="mt-1 text-sm text-white/90">
                {provider.profession
                  ? `Experienced ${provider.profession}. Book now to get reliable service at your doorstep.`
                  : "Book now to get reliable service at your doorstep."}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="h-11 rounded-2xl px-5 font-semibold border border-white/20 bg-white/10 hover:bg-white/15 transition"
              >
                Close
              </button>

              {onBook ? (
                <button
                  onClick={onBook}
                  className="h-11 rounded-2xl px-6 font-extrabold bg-white text-slate-900 hover:bg-white/90 transition inline-flex items-center gap-2"
                >
                  <CalendarCheck className="h-4 w-4" />
                  Book Now
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}