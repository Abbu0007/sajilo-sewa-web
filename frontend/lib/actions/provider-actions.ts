"use server";

import {
  AppNotification,
  ProviderBooking,
  ProviderMe,
  ProviderProfile,
} from "../types/provider";
import { getAuthToken } from "../cookie";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiFetch(path: string, init?: RequestInit) {
  const auth = await authHeaders();

  const initHeaders =
    init?.headers instanceof Headers
      ? Object.fromEntries(init.headers.entries())
      : (init?.headers as Record<string, string> | undefined) ?? {};

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...initHeaders,
      ...auth,
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = (data?.message || data?.error || "Request failed").toString();
    throw new Error(msg);
  }

  return data;
}

// -------- ME --------
export async function providerGetMe(): Promise<ProviderMe> {
  const data = await apiFetch("/api/users/me");
  const u = data.user ?? data;

  return {
    id: (u._id ?? u.id ?? "").toString(),
    firstName: u.firstName ?? "",
    lastName: u.lastName ?? "",
    email: u.email ?? null,
    phone: u.phone ?? null,
    avatarUrl: u.avatarUrl ?? null,
    role: u.role ?? null,
    profession: u.profession ?? null,
    serviceSlug: u.serviceSlug ?? null,
  };
}

export async function providerUpdateMe(input: { firstName: string; lastName: string }) {
  const data = await apiFetch("/api/users/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return data.user ?? data;
}

export async function providerUploadAvatar(file: File) {
  const form = new FormData();
  form.append("avatar", file);

  const auth = await authHeaders();

  const res = await fetch(`${API_BASE}/api/users/me/avatar`, {
    method: "POST",
    headers: {
      ...auth,
    },
    body: form,
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = (data?.message || data?.error || "Avatar upload failed").toString();
    throw new Error(msg);
  }

  return data.user ?? data;
}

// -------- PROVIDER PROFILE --------
export async function providerGetProfile(): Promise<ProviderProfile | null> {
  const data = await apiFetch("/api/providers/me/profile");
  const p = data.profile;

  if (!p) return null;

  return {
    id: (p._id ?? "").toString(),
    userId: (p.userId ?? "").toString(),
    profession: p.profession ?? "",
    startingPrice: typeof p.startingPrice === "number" ? p.startingPrice : 0,
    ratingAvg: typeof p.ratingAvg === "number" ? p.ratingAvg : 0,
    ratingCount: typeof p.ratingCount === "number" ? p.ratingCount : 0,
    completedJobs: typeof p.completedJobs === "number" ? p.completedJobs : 0,
  };
}

export async function providerUpdateProfile(input: { profession: string; startingPrice?: number }) {
  const data = await apiFetch("/api/providers/me/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return data.profile ?? data;
}

// -------- BOOKINGS --------
export async function providerGetBookings(status: string = "all"): Promise<ProviderBooking[]> {
  const data = await apiFetch(`/api/provider/bookings/mine?status=${encodeURIComponent(status)}`);
  const items = (data.items ?? []) as any[];

  return items.map((b) => ({
    id: (b._id ?? "").toString(),
    status: (b.status ?? "pending").toString(),
    scheduledAt: b.scheduledAt ?? "",
    note: b.note ?? "",
    addressText: b.addressText ?? "",
    price: typeof b.price === "number" ? b.price : 0,
    paymentStatus: (b.paymentStatus ?? "").toString(),
    client: b.clientId
      ? {
          id: (b.clientId._id ?? b.clientId).toString(),
          firstName: b.clientId.firstName ?? "",
          lastName: b.clientId.lastName ?? "",
          phone: b.clientId.phone ?? "",
          avatarUrl: b.clientId.avatarUrl ?? "",
          ratingAvg: typeof b.clientId.ratingAvg === "number" ? b.clientId.ratingAvg : 0,
          ratingCount: typeof b.clientId.ratingCount === "number" ? b.clientId.ratingCount : 0,
          completedBookings:
            typeof b.clientId.completedBookings === "number" ? b.clientId.completedBookings : 0,
        }
      : null,
    service: b.serviceId
      ? {
          id: (b.serviceId._id ?? b.serviceId).toString(),
          name: b.serviceId.name ?? "",
          icon: b.serviceId.icon ?? "",
          basePriceFrom: b.serviceId.basePriceFrom ?? 0,
        }
      : null,
  }));
}

export async function providerAcceptBooking(id: string) {
  const data = await apiFetch(`/api/provider/bookings/${id}/accept`, { method: "PATCH" });
  return data.booking ?? data;
}

export async function providerRejectBooking(id: string, reason?: string) {
  const body = reason?.trim() ? { reason: reason.trim() } : {};

  const data = await apiFetch(`/api/provider/bookings/${id}/reject`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return data.booking ?? data;
}

export async function providerUpdateBookingStatus(
  id: string,
  status: "in_progress" | "awaiting_payment_confirmation" | "cancelled",
  opts?: { reason?: string; price?: number }
) {
  const body: any = { status };

  if (opts?.reason?.trim()) body.reason = opts.reason.trim();

  if (status === "awaiting_payment_confirmation") {
    const price = typeof opts?.price === "number" ? opts!.price : NaN;
    if (!Number.isFinite(price) || price <= 0) {
      throw new Error("Final price is required");
    }
    body.price = price;
  }

  const data = await apiFetch(`/api/provider/bookings/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return data.booking ?? data;
}


export async function providerGetNotifications(): Promise<AppNotification[]> {
  const data = await apiFetch("/api/notifications");
  const items = (data.items ?? []) as any[];

  return items.map((n) => ({
    id: (n._id ?? "").toString(),
    title: n.title ?? "Notification",
    message: n.message ?? "",
    type: n.type ?? "",
    isRead: !!n.isRead,
    createdAt: n.createdAt ?? new Date().toISOString(),
    bookingId: n.bookingId ? n.bookingId.toString() : null,
  }));
}

export async function providerMarkNotificationRead(id: string) {
  await apiFetch(`/api/notifications/${id}/read`, { method: "PATCH" });
}

export async function providerCreateRating(input: { bookingId: string; stars: number; comment?: string }) {
  await apiFetch("/api/ratings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      bookingId: input.bookingId,
      stars: input.stars,
      comment: input.comment?.trim() ? input.comment.trim() : undefined,
    }),
  });
}

export async function providerGetEarnings(): Promise<{ total: number }> {
  const data = await apiFetch("/api/provider/bookings/earnings");
  return { total: typeof data.total === "number" ? data.total : 0 };
}