"use client";

import { useMemo, useState } from "react";
import type { ProviderItem, ServiceItem } from "@/lib/actions/client-actions";
import { toggleFavourite } from "@/lib/actions/client-actions";
import ProviderCard from "../../_components/ProviderCard";
import ProviderDetailsModal from "../../_components/modals/ProviderDetailsModal";
import BookingModal from "../../_components/modals/BookingModal";
import EmptyState from "../../_components/ui/EmptyState";

export default function FavouritesClient({
  initialItems,
  services,
}: {
  initialItems: ProviderItem[];
  services: ServiceItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const [selected, setSelected] = useState<ProviderItem | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  const serviceIdBySlug = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of services) map.set(s.slug, s._id);
    return map;
  }, [services]);

  const selectedServiceId =
    selected?.serviceSlug ? serviceIdBySlug.get(selected.serviceSlug) || undefined : undefined;

  async function removeFavourite(id: string) {
    await toggleFavourite(id);
    setItems((prev) => prev.filter((x) => x._id !== id));

    if (selected?._id === id) {
      setSelected(null);
      setDetailsOpen(false);
      setBookingOpen(false);
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
    <div className="rounded-[28px] bg-white/60 backdrop-blur border border-white/30 shadow-[0_20px_80px_rgba(2,6,23,0.08)] p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-extrabold text-slate-900">Favourites</div>
          <div className="text-sm text-slate-600">Your saved providers.</div>
        </div>
      </div>

      <div className="mt-5">
        {items.length === 0 ? (
          <EmptyState title="No favourites yet" description="Open a provider and tap the heart." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {items.map((p) => (
              <ProviderCard
                key={p._id}
                provider={p}
                isFavourite={true}
                onOpen={() => openDetails(p)}
                onBook={() => openBooking(p)}
                onToggleFavourite={() => removeFavourite(p._id)}
              />
            ))}
          </div>
        )}
      </div>

      <ProviderDetailsModal
        open={detailsOpen}
        provider={selected}
        isFavourite={true}
        onToggleFavourite={() => {
          if (!selected) return;
          removeFavourite(selected._id);
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
    </div>
  );
}