"use server";

import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

async function getTokenFromCookies() {
  const jar = await cookies();
  const raw = jar.get("ss_token")?.value;
  if (!raw) return "";
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

async function adminFetch(path: string, init?: RequestInit) {
  const token = await getTokenFromCookies();
  if (!token) throw new Error("Not authenticated (token missing)");

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed (${res.status})`);
  }

  return res.json();
}

export type AdminBookingItem = {
  id: string;
  status: string;
  scheduledAt?: string | null;
  note?: string;
  addressText?: string;
  price?: number;
  paymentStatus?: string;

  service?: { id: string; name: string; slug?: string; imageUrl?: string } | null;

  client?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
    ratingAvg?: number;
    ratingCount?: number;
    completedBookings?: number;
  } | null;

  provider?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
    profession?: string;
    serviceSlug?: string;
    ratingAvg?: number;
    ratingCount?: number;
    completedBookings?: number;
  } | null;
};

export async function adminListBookings(params: {
  status?: string;
  q?: string;
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
}) {
  const sp = new URLSearchParams();
  if (params.status) sp.set("status", params.status);
  if (params.q) sp.set("q", params.q);
  if (params.page) sp.set("page", String(params.page));
  if (params.limit) sp.set("limit", String(params.limit));
  if (params.dateFrom) sp.set("dateFrom", params.dateFrom);
  if (params.dateTo) sp.set("dateTo", params.dateTo);

  const data = await adminFetch(`/api/admin/bookings?${sp.toString()}`);
  return data as {
    items: AdminBookingItem[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function adminGetBooking(bookingId: string) {
  const data = await adminFetch(`/api/admin/bookings/${bookingId}`);
  return data as { booking: AdminBookingItem };
}

export async function adminCancelBooking(bookingId: string, reason?: string) {
  const data = await adminFetch(`/api/admin/bookings/${bookingId}/cancel`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason: reason ?? "" }),
  });
  return data as { booking: any };
}

export async function adminDeleteBooking(bookingId: string) {
  const data = await adminFetch(`/api/admin/bookings/${bookingId}`, {
    method: "DELETE",
  });
  return data as { ok: boolean; deletedId: string };
}