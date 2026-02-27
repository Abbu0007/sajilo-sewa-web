"use client";

import { useMemo, useState } from "react";
import { ProviderBooking } from "@/lib/types/provider";
import ProviderBookingCard from "@/app/provider/_components/ui/ProviderBookingCard";
import BookingDetailsModal from "@/app/provider/_components/modals/BookingDetailsModal";

type Props = {
  initialItems: ProviderBooking[];
};

export default function ProviderBookingsClient({ initialItems }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  const openBooking = useMemo(
    () => initialItems.find((b) => b.id === openId) ?? null,
    [openId, initialItems]
  );

  return (
    <div className="space-y-4">
      {initialItems.map((b) => (
        <div key={b.id} onClick={() => setOpenId(b.id)} className="cursor-pointer">
          <ProviderBookingCard booking={b} />
        </div>
      ))}

      {openBooking && (
        <BookingDetailsModal
          booking={openBooking}
          onClose={() => setOpenId(null)}
          onChanged={() => window.location.reload()}
        />
      )}
    </div>
  );
}