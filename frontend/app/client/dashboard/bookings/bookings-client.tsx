"use client";

import { useMemo, useState } from "react";
import type { BookingItem } from "@/lib/actions/client-actions";
import EmptyState from "../../_components/ui/EmptyState";
import ClientBookingCard from "../../_components/ClientBookingCard";
import ClientBookingDetailsModal from "../../_components/modals/ClientBookingsDetailModal";

type Props = {
  initialItems: BookingItem[];
};

export default function ClientBookingsClient({ initialItems }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  const openBooking = useMemo(
    () => initialItems.find((b) => b._id === openId) ?? null,
    [openId, initialItems]
  );

  if (!initialItems || initialItems.length === 0) {
    return (
      <div className="rounded-3xl bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] ring-1 ring-black/5 p-6">
        <EmptyState title="No bookings found" description="Book a provider from Home or Services." />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {initialItems.map((b) => (
          <div
            key={b._id}
            onClick={() => setOpenId(b._id)}
            className="cursor-pointer"
          >
            <ClientBookingCard booking={b} />
          </div>
        ))}
      </div>

      {openBooking && (
        <ClientBookingDetailsModal
          booking={openBooking}
          onClose={() => setOpenId(null)}
          onChanged={() => window.location.reload()}
        />
      )}
    </>
  );
}