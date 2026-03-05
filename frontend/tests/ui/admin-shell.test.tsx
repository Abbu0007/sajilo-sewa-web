import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AdminShell from "@/app/admin/_components/AdminShell";

// ---- mock logoutAction (used inside startTransition async) ----
jest.mock("@/lib/actions/auth-actions", () => ({
  logoutAction: jest.fn(async () => {}),
}));

// ---- mock next/navigation hooks ----
const push = jest.fn();
const refresh = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(() => ({
    push,
    refresh,
    replace: jest.fn(),
    prefetch: jest.fn(),
  })),
}));

const { usePathname } = jest.requireMock("next/navigation");

describe("AdminShell", () => {
  beforeEach(() => {
    push.mockClear();
    refresh.mockClear();
  });

  test("renders tabs and children", () => {
    usePathname.mockReturnValue("/admin/dashboard");
    render(
      <AdminShell>
        <div>CHILD</div>
      </AdminShell>
    );

    expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Overview/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Users/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Bookings/i })).toBeInTheDocument();
    expect(screen.getByText("CHILD")).toBeInTheDocument();
  });

  test("logout triggers router push to /login", async () => {
    usePathname.mockReturnValue("/admin/dashboard");

    render(
      <AdminShell>
        <div>CHILD</div>
      </AdminShell>
    );

    fireEvent.click(screen.getByRole("button", { name: /logout/i }));

    // startTransition is async -> wait for it
    await waitFor(() => {
      expect(push).toHaveBeenCalledWith("/login");
      expect(refresh).toHaveBeenCalled();
    });
  });

  test("highlights active tab based on pathname", () => {
    usePathname.mockReturnValue("/admin/dashboard/bookings");
    render(
      <AdminShell>
        <div>CHILD</div>
      </AdminShell>
    );

    const bookings = screen.getByRole("link", { name: /Bookings/i });
    expect(bookings.className).toMatch(/bg-white/); // active uses bg-white text-slate-900
  });
});