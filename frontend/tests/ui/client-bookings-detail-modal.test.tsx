import { render, screen, fireEvent } from "@testing-library/react";
import ClientBookingsDetailModal from "@/app/client/_components/modals/ClientBookingsDetailModal";
import * as clientActions from "@/lib/actions/client-actions";

jest.spyOn(clientActions, "cancelMyBooking").mockResolvedValue({} as any);

describe("ClientBookingsDetailModal", () => {
  test("renders and allows cancel when status is pending", async () => {
    const onClose = jest.fn();
    const onChanged = jest.fn();

    render(
      <ClientBookingsDetailModal
        booking={{
          _id: "b1",
          status: "pending",
          scheduledAt: new Date().toISOString(),
          addressText: "KTM",
          paymentStatus: "unpaid",
          price: 0,
          providerId: { firstName: "Ram", lastName: "Bahadur", profession: "Plumber", serviceSlug: "repairing" } as any,
          serviceId: { name: "Repairing" } as any,
        } as any}
        onClose={onClose}
        onChanged={onChanged}
      />
    );

    expect(screen.getByText(/Booking ID/i)).toBeInTheDocument();
    expect(screen.getByText("KTM")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Reason (optional)"), {
      target: { value: "test reason" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(clientActions.cancelMyBooking).toHaveBeenCalledWith("b1", "test reason");
  });

  test("shows Pay Now CTA only when awaiting_payment_confirmation + unpaid + price>0", () => {
    render(
      <ClientBookingsDetailModal
        booking={{
          _id: "b2",
          status: "awaiting_payment_confirmation",
          scheduledAt: new Date().toISOString(),
          paymentStatus: "unpaid",
          price: 100,
          providerId: { firstName: "A", lastName: "B" } as any,
          serviceId: { name: "Service" } as any,
        } as any}
        onClose={() => {}}
        onChanged={() => {}}
      />
    );

    expect(screen.getByRole("button", { name: "Pay Now" })).toBeInTheDocument();
  });
});