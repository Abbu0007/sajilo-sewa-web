"use server";

import { apiGet, apiPatch, apiPost, apiPostForm } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export type ServiceItem = {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  basePriceFrom?: number;
};

export type ProviderItem = {
  _id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  profession?: string;
  serviceSlug?: string;
  avatarUrl?: string;
  ratingAvg?: number;
  ratingCount?: number;
  startingPrice?: number;
  completedJobs?: number;
};

export type BookingItem = {
  _id: string;
  status: string;
  scheduledAt: string;
  note?: string;
  addressText?: string;
  price?: number;
  paymentStatus?: string;
  providerId?: ProviderItem;
  serviceId?: {
    _id: string;
    name: string;
    slug: string;
    basePriceFrom?: number;
    icon?: string;
  };
};

export type NotificationMeta = {
  rateeRole?: "provider" | "client" | string;
  rateeId?: string;
  [key: string]: any;
};

export type NotificationItem = {
  _id: string;
  title?: string;
  message?: string;
  createdAt?: string;
  isRead?: boolean;
  type?: string;
  bookingId?: string | null;
  meta?: NotificationMeta | null;
};

export type ClientProfileStats = {
  userId: string;
  ratingAvg: number;
  ratingCount: number;
  completedBookings: number;
};

export async function getServices() {
  return apiGet<{ items: ServiceItem[] }>(ENDPOINTS.services, false);
}

function normalizeProvider(p: any): ProviderItem {
  const ratingAvg =
    typeof p.avgRating === "number"
      ? p.avgRating
      : typeof p.ratingAvg === "number"
      ? p.ratingAvg
      : typeof p.profile?.ratingAvg === "number"
      ? p.profile.ratingAvg
      : typeof p.providerProfile?.ratingAvg === "number"
      ? p.providerProfile.ratingAvg
      : 0;

  const ratingCount =
    typeof p.ratingCount === "number"
      ? p.ratingCount
      : typeof p.profile?.ratingCount === "number"
      ? p.profile.ratingCount
      : typeof p.providerProfile?.ratingCount === "number"
      ? p.providerProfile.ratingCount
      : 0;

  const startingPrice =
    typeof p.startingPrice === "number"
      ? p.startingPrice
      : typeof p.profile?.startingPrice === "number"
      ? p.profile.startingPrice
      : typeof p.providerProfile?.startingPrice === "number"
      ? p.providerProfile.startingPrice
      : 0;

  const completedJobs =
    typeof p.completedJobs === "number"
      ? p.completedJobs
      : typeof p.jobsDone === "number"
      ? p.jobsDone
      : typeof p.profile?.completedJobs === "number"
      ? p.profile.completedJobs
      : typeof p.providerProfile?.completedJobs === "number"
      ? p.providerProfile.completedJobs
      : 0;

  return {
    _id: (p._id ?? "").toString(),
    firstName: p.firstName ?? "",
    lastName: p.lastName ?? "",
    phone: p.phone ?? "",
    email: p.email ?? "",
    profession: p.profession ?? "",
    serviceSlug: p.serviceSlug ?? "",
    avatarUrl: p.avatarUrl ?? "",
    ratingAvg,
    ratingCount,
    startingPrice,
    completedJobs,
  };
}

export async function getProvidersByService(slug: string) {
  const data = await apiGet<{ items: any[] }>(ENDPOINTS.providersByService(slug), false);
  return { items: (data.items ?? []).map(normalizeProvider) };
}

export async function getTopRatedProviders(limit: number = 8) {
  const data = await apiGet<{ items: any[] }>(ENDPOINTS.topRatedProviders(limit), false);
  return { items: (data.items ?? []).map(normalizeProvider) };
}

export async function getMyBookings(status: string = "all") {
  return apiGet<{ items: BookingItem[] }>(ENDPOINTS.myBookings(status), true);
}

export async function createBooking(payload: {
  providerId: string;
  serviceId: string;
  scheduledAt: string;
  note?: string;
  addressText?: string;
}) {
  return apiPost<{ booking: BookingItem }>(ENDPOINTS.createBooking, payload, true);
}

export async function confirmBookingPayment(bookingId: string) {
  return apiPatch<{ booking: BookingItem }>(`/api/bookings/${bookingId}/confirm-payment`, {}, true);
}

export async function cancelMyBooking(bookingId: string, reason?: string) {
  return apiPatch<{ booking: BookingItem }>(
    `/api/bookings/${bookingId}/cancel`,
    reason?.trim() ? { reason: reason.trim() } : {},
    true
  );
}
export async function getFavourites() {
  const data = await apiGet<{ items: any[] }>(ENDPOINTS.favourites, true);
  return { items: (data.items ?? []).map(normalizeProvider) };
}

export async function toggleFavourite(providerId: string) {
  return apiPost<{ ok: boolean; isFavourite: boolean }>(ENDPOINTS.favouriteToggle(providerId), {}, true);
}

export async function getNotifications(): Promise<{ items: NotificationItem[] }> {
  const data = await apiGet<{ items: any[] }>(ENDPOINTS.notifications, true);
  const raw = (data.items ?? []) as any[];

  const items: NotificationItem[] = raw.map((n) => ({
    _id: (n._id ?? "").toString(),
    title: n.title ?? "Notification",
    message: n.message ?? "",
    createdAt: n.createdAt ?? new Date().toISOString(),
    isRead: !!n.isRead,
    type: n.type ?? "",
    bookingId: n.bookingId ? n.bookingId.toString() : null,
    meta: n.meta ?? null,
  }));

  return { items };
}

export async function markNotificationRead(id: string) {
  return apiPatch<{ ok: boolean }>(ENDPOINTS.notificationRead(id), {}, true);
}

export async function createRating(input: { bookingId: string; stars: number; comment?: string }) {
  return apiPost<{ ok: boolean }>(
    ENDPOINTS.ratings,
    {
      bookingId: input.bookingId,
      stars: input.stars,
      comment: input.comment?.trim() ? input.comment.trim() : undefined,
    },
    true
  );
}

export async function getMe() {
  return apiGet<any>(ENDPOINTS.me, true);
}

export async function updateMe(payload: { firstName?: string; lastName?: string }) {
  return apiPatch<any>(ENDPOINTS.updateMe, payload, true);
}

export async function uploadMyAvatar(file: File) {
  const fd = new FormData();
  fd.append("avatar", file);
  return apiPostForm<{ ok: boolean; user: any }>(`/api/users/me/avatar`, fd, true);
}

export async function getClientProfile() {
  return apiGet<{ profile: ClientProfileStats }>(ENDPOINTS.clientMeProfile, true);
}