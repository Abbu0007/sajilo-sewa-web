"use client";

import { useState } from "react";
import type { ProviderItem, ServiceItem } from "@/lib/actions/client-actions";
import GlassCard from "@/app/client/_components/ui/GlassCard";
import SectionHeader from "@/app/client/_components/ui/SectionHeader";
import EmptyState from "@/app/client/_components/ui/EmptyState";
import ProviderCard from "@/app/client/_components/ProviderCard";
import ProviderDetailsModal from "@/app/client/_components/modals/ProviderDetailsModal";
import BookingModal from "@/app/client/_components/modals/BookingModal";
import { toggleFavourite } from "@/lib/actions/client-actions";

export default function ServiceProvidersClient({
  slug,
  service,
  providers,
}: {
  slug: string;
  service: ServiceItem | null;
  providers: ProviderItem[];
}) {
  const [selected, setSelected] = useState<ProviderItem | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [favMap, setFavMap] = useState<Record<string, boolean>>({});

  const serviceId = service?._id; 

  async function onToggleFavourite(p: ProviderItem) {
    try {
      const res = await toggleFavourite(p._id);
      setFavMap((m) => ({ ...m, [p._id]: res.isFavourite }));
    } catch {
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
    <div className="space-y-6">
     
      <div className="relative overflow-hidden rounded-3xl border border-white/35 bg-gradient-to-br from-blue-700 via-blue-800 to-slate-950 text-white p-6 sm:p-8">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-28 -bottom-28 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative">
          <div className="text-2xl sm:text-3xl font-extrabold">{service?.name ?? slug}</div>
          <div className="mt-2 text-sm text-white/80">Choose a provider and book instantly.</div>
        </div>
      </div>

      
      <GlassCard className="p-5 sm:p-6">
        <SectionHeader title="Available Providers" description="View details, add to favourites, or book." />

        {providers.length === 0 ? (
          <div className="mt-5">
            <EmptyState title="No providers available" description="No providers found for this service yet." />
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
      </GlassCard>
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
        serviceId={serviceId}
        onClose={() => setBookingOpen(false)}
      />
    </div>
  );
}