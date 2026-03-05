import { render, screen, fireEvent } from "@testing-library/react";
import BookingDetailsModal from "@/app/provider/_components/modals/BookingDetailsModal";

jest.mock("@/lib/actions/provider-actions", () => ({
  providerAcceptBooking: jest.fn().mockResolvedValue({}),
  providerRejectBooking: jest.fn().mockResolvedValue({}),
  providerUpdateBookingStatus: jest.fn().mockResolvedValue({}),
}));

describe("Provider BookingDetailsModal", () => {
  test("shows Accept/Reject when status pending", () => {
    render(
      <BookingDetailsModal
        booking={{
          id: "b1",
          status: "pending",
          scheduledAt: new Date().toISOString(),
          client: { firstName: "A", lastName: "B", ratingAvg: 4, ratingCount: 1, completedBookings: 2 },
          service: { name: "Repairing" },
        } as any}
        onClose={() => {}}
        onChanged={() => {}}
      />
    );

    expect(screen.getByRole("button", { name: "Accept" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reject" })).toBeInTheDocument();
  });

  test("opens final price modal in in_progress", () => {
    render(
      <BookingDetailsModal
        booking={{
          id: "b2",
          status: "in_progress",
          scheduledAt: new Date().toISOString(),
          client: { firstName: "A", lastName: "B", ratingAvg: 4, ratingCount: 1, completedBookings: 2 },
          service: { name: "Repairing" },
        } as any}
        onClose={() => {}}
        onChanged={() => {}}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Set Final Price" }));
    expect(screen.getByText("Final price")).toBeInTheDocument();
  });
});