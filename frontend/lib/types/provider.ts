export type ProviderMe = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  role?: string | null;
  profession?: string | null;
  serviceSlug?: string | null;
};

export type ProviderProfile = {
  id: string;
  userId: string;
  profession: string;
  startingPrice?: number | null;
  ratingAvg: number;
  ratingCount: number;
  completedJobs: number;
};

export type ProviderBookingStatus =
  | "pending"
  | "confirmed"
  | "rejected"
  | "in_progress"
  | "awaiting_payment_confirmation"
  | "completed"
  | "cancelled";

export type ProviderPaymentStatus = "" | "unpaid" | "paid" | "refunded" | "pending_confirmation";

export type ProviderBooking = {
  id: string;
  status: ProviderBookingStatus | string;
  scheduledAt: string;
  note?: string;
  addressText?: string;
  price?: number;
  paymentStatus?: ProviderPaymentStatus | string;
  client?: {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatarUrl?: string;
    ratingAvg?: number;
    ratingCount?: number;
    completedBookings?: number;
  } | null;
  service?: {
    id: string;
    name: string;
    icon?: string;
    basePriceFrom?: number;
  } | null;
};

export type AppNotification = {
  id: string;
  title?: string;
  message?: string;
  type?: string;
  isRead: boolean;
  createdAt: string;
  bookingId?: string | null;
};