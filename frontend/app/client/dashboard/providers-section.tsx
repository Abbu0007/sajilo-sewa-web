"use client";

import { useMemo, useState } from "react";
import type { ProviderItem, ServiceItem } from "@/lib/actions/client-actions";
import ProviderCard from "../_components/ProviderCard";
import EmptyState from "../_components/ui/EmptyState";
import GlassCard from "../_components/ui/GlassCard";
import SectionHeader from "../_components/ui/SectionHeader";
import ProviderDetailsModal from "../_components/modals/ProviderDetailsModal";
import BookingModal from "../_components/modals/BookingModal";
import { toggleFavourite } from "@/lib/actions/client-actions";

export default function ProvidersSection({
  initialProviders,
  services,
  initialFavourites, // ✅ NEW
}: {
  initialProviders: ProviderItem[];
  services: ServiceItem[];
  initialFavourites: ProviderItem[]; // ✅ NEW
}) {
  const [providers] = useState<ProviderItem[]>(initialProviders || []);
  const [selected, setSelected] = useState<ProviderItem | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  const [favMap, setFavMap] = useState<Record<string, boolean>>(() => {
    const m: Record<string, boolean> = {};
    for (const f of initialFavourites || []) m[f._id] = true;
    return m;
  });

  const serviceIdBySlug = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of services) map.set(s.slug, s._id);
    return map;
  }, [services]);

  const selectedServiceId =
    selected?.serviceSlug ? serviceIdBySlug.get(selected.serviceSlug) || undefined : undefined;

  async function onToggleFavourite(p: ProviderItem) {
    setFavMap((m) => ({ ...m, [p._id]: !m[p._id] }));

    try {
      const res = await toggleFavourite(p._id);
      setFavMap((m) => ({ ...m, [p._id]: res.isFavourite }));
    } catch {
      // revert if failed
      setFavMap((m) => ({ ...m, [p._id]: !m[p._id] }));
    }
  }

  function openDetails(p: ProviderItem) {
    setSelected(p);
    setDetailsOpen(true);
  }

  function openBooking(p: ProviderItem) {
    setSelected(p);
    setBookingOpen(true);
  }

  return (
    <GlassCard className="p-5 sm:p-6">
      <SectionHeader
        title="Top Rated Professionals"
        description="Hand-picked providers based on performance & reliability."
      />

      {providers.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            title="No top-rated providers yet."
            description="Once you have providers and your backend returns /api/providers/top-rated, they will appear here."
          />
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((p) => (
            <ProviderCard
              key={p._id}
              provider={p}
              isFavourite={!!favMap[p._id]} 
              onOpen={() => openDetails(p)}
              onBook={() => openBooking(p)}
              onToggleFavourite={() => onToggleFavourite(p)}
            />
          ))}
        </div>
      )}

      <ProviderDetailsModal
        open={detailsOpen}
        provider={selected}
        isFavourite={selected ? !!favMap[selected._id] : false} 
        onToggleFavourite={() => {
          if (selected) onToggleFavourite(selected);
        }}
        onBook={() => {
          if (!selected) return;
          setDetailsOpen(false);
          setBookingOpen(true);
        }}
        onClose={() => setDetailsOpen(false)}
      />

      <BookingModal
        open={bookingOpen}
        provider={selected}
        serviceId={selectedServiceId}
        onClose={() => setBookingOpen(false)}
      />
    </GlassCard>
  );
}