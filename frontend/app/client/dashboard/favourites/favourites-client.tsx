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
  const [items, setItems] = useState<ProviderItem[]>(initialItems);
  const [selected, setSelected] = useState<ProviderItem | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const serviceIdBySlug = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of services) map.set(s.slug, s._id);
    return map;
  }, [services]);

  const selectedServiceId =
    selected?.serviceSlug ? serviceIdBySlug.get(selected.serviceSlug) || undefined : undefined;

  async function removeFavourite(id: string) {
    if (busyId) return;

    setBusyId(id);
    try {
      await toggleFavourite(id);

      setItems((prev) => prev.filter((x) => x._id !== id));

      if (selected?._id === id) {
        setSelected(null);
        setDetailsOpen(false);
        setBookingOpen(false);
      }
    } finally {
      setBusyId(null);
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
    <div className="space-y-5">
      {/* Header (solid) */}
      <div className="rounded-3xl bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] ring-1 ring-black/5 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-extrabold text-slate-900">Favourites</div>
            <div className="text-sm text-slate-600">Your saved providers.</div>
          </div>

          <div className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
            Total: {items.length}
          </div>
        </div>
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="rounded-3xl bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] ring-1 ring-black/5 p-6">
          <EmptyState title="No favourites yet" description="Open a provider and tap the heart." />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((p) => (
            <div key={p._id} className={busyId === p._id ? "opacity-70 pointer-events-none" : ""}>
              <ProviderCard
                provider={p}
                isFavourite={true}
                onOpen={() => openDetails(p)}
                onBook={() => openBooking(p)}
                onToggleFavourite={() => removeFavourite(p._id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
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

      {/* Booking Modal */}
      <BookingModal
        open={bookingOpen}
        provider={selected}
        serviceId={selectedServiceId}
        onClose={() => setBookingOpen(false)}
      />
    </div>
  );
}