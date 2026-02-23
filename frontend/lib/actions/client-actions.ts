"use server";

import { apiDelete, apiGet, apiPatch, apiPost, apiPostForm } from "@/lib/api/client";
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
};

export type BookingItem = {
  _id: string;
  status: string;
  scheduledAt: string;
  note?: string;
  addressText?: string;
  price?: number;
  providerId?: ProviderItem;
  serviceId?: { _id: string; name: string; slug: string; basePriceFrom?: number; icon?: string };
};

export type NotificationItem = {
  _id: string;
  title?: string;
  message?: string;
  createdAt?: string;
  isRead?: boolean;
};

export async function getServices() {
  return apiGet<{ items: ServiceItem[] }>(ENDPOINTS.services, false);
}

export async function getProvidersByService(slug: string) {
  return apiGet<{ items: ProviderItem[] }>(ENDPOINTS.providersByService(slug), false);
}

export async function getTopRatedProviders(limit: number = 8) {
  return apiGet<{ items: ProviderItem[] }>(ENDPOINTS.topRatedProviders(limit), false);
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


export async function getFavourites() {
  return apiGet<{ items: ProviderItem[] }>(ENDPOINTS.favourites, true);
}

export async function toggleFavourite(providerId: string) {
  return apiPost<{ ok: boolean; isFavourite: boolean }>(
    ENDPOINTS.favouriteToggle(providerId),
    {},
    true
  );
}


export async function getNotifications() {
  return apiGet<{ items: NotificationItem[] }>(ENDPOINTS.notifications, true);
}

export async function markNotificationRead(id: string) {
  return apiPatch<{ ok: boolean }>(ENDPOINTS.notificationRead(id), {}, true);
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