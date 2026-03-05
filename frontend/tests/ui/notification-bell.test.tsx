import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import NotificationBell from "@/app/provider/_components/modals/BaseModal";

const markRead = jest.fn<Promise<void>, [string]>(async (_id: string) => {});

jest.mock("@/lib/actions/provider-actions", () => ({
  providerMarkNotificationRead: (id: string) => markRead(id),
}));

jest.mock("@/app/provider/_components/modals/RatingModal", () => ({
  __esModule: true,
  default: ({ bookingId }: any) => <div>RatingModal {bookingId}</div>,
}));

describe("NotificationBell", () => {
  beforeEach(() => {
    markRead.mockClear();
  });

  test("shows unread badge", () => {
    render(<NotificationBell unread={3} notifications={[]} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  test("opens list on bell click", () => {
    render(
      <NotificationBell
        unread={1}
        notifications={[
          {
            id: "n1",
            title: "Hello",
            message: "World",
            type: "info",
            isRead: false,
            createdAt: new Date().toISOString(),
            bookingId: null,
          },
        ]}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /notifications/i }));
    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("World")).toBeInTheDocument();
  });

  test("clicking unread notification marks it read", async () => {
    render(
      <NotificationBell
        unread={1}
        notifications={[
          {
            id: "n1",
            title: "Hello",
            message: "World",
            type: "info",
            isRead: false,
            createdAt: new Date().toISOString(),
            bookingId: null,
          },
        ]}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /notifications/i }));
    fireEvent.click(screen.getByRole("button", { name: /hello/i }));

    await waitFor(() => {
      expect(markRead).toHaveBeenCalledWith("n1");
    });
  });

  test("clicking rating_request notification opens RatingModal", async () => {
    render(
      <NotificationBell
        unread={1}
        notifications={[
          {
            id: "n2",
            title: "Rate provider",
            message: "Please rate",
            type: "rating_request",
            isRead: false,
            createdAt: new Date().toISOString(),
            bookingId: "b99",
          },
        ]}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /notifications/i }));
    fireEvent.click(screen.getByRole("button", { name: /rate provider/i }));

    // state updates happen async -> use findByText
    expect(await screen.findByText("RatingModal b99")).toBeInTheDocument();
  });
});