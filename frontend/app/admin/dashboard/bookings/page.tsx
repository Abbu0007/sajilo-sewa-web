import { adminListBookings } from "@/lib/actions/admin-bookings.actions";
import BookingsClient from "./bookings-client";
type SP = {
  status?: string;
  q?: string;
  page?: string;
};

export default async function AdminBookingsPage(props: { searchParams: any }) {
  const sp: SP = await Promise.resolve(props.searchParams);

  const status = sp.status ?? "all";
  const q = sp.q ?? "";
  const page = Number(sp.page ?? 1);

  const data = await adminListBookings({ status, q, page, limit: 12 });

  return (
    <BookingsClient
      initial={data}
      initialStatus={status}
      initialQuery={q}
    />
  );
}