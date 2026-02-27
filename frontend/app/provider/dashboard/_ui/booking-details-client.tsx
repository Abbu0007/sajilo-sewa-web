"use client";

import { ReactNode, useState } from "react";
import { ProviderBooking } from "@/lib/types/provider";
import BookingDetailsModal from "../../_components/modals/BookingDetailsModal";

export default function BookingDetailsClient({
  booking,
  children,
}: {
  booking: ProviderBooking;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [b, setB] = useState(booking);

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>
      {open && (
        <BookingDetailsModal
          booking={b}
          onClose={() => setOpen(false)}
          onChanged={() => window.location.reload()}
        />
      )}
    </>
  );
}