export type Service = {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  basePriceFrom?: number;
};

export type PublicUser = {
  _id?: string;
  id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role?: string;
  avatarUrl?: string;
  profession?: string;
  serviceSlug?: string;
};

export type Provider = {
  _id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  profession?: string;
  serviceSlug?: string;
  rating?: number;
  jobsDone?: number;
  status?: "Available" | "Busy";
};

export type Booking = {
  _id: string;
  clientId: any;
  providerId: any;
  serviceId: any;
  scheduledAt: string;
  note?: string;
  addressText?: string;
  price?: number;
  status: string;
  paymentStatus?: string;
  createdAt: string;
};

export type NotificationItem = {
  _id: string;
  title?: string;
  message?: string;
  read?: boolean;
  createdAt: string;
  bookingId?: any;
};
