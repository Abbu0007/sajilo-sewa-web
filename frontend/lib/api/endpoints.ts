export const ENDPOINTS = {
  // auth
  login: "/api/auth/login",
  register: "/api/auth/register",

  // admin users
  adminUsers: "/api/admin/users",
  adminUserById: (id: string) => `/api/admin/users/${id}`,

  // client/public
  services: "/api/services",
  providers: "/api/providers",
  providersByService: (slug: string) => `/api/providers/by-service/${slug}`,
  topRatedProviders: (limit: number = 8) => `/api/providers/top-rated?limit=${limit}`,

  // bookings (client)
  createBooking: "/api/bookings",
  myBookings: (status: string = "all") => `/api/bookings/mine?status=${status}`,

  // favourites (client)
  favourites: "/api/favourites",
  favouriteToggle: (providerId: string) => `/api/favourites/${providerId}`,

  // notifications
  notifications: "/api/notifications",
  notificationRead: (id: string) => `/api/notifications/${id}/read`,

  ratings: "/api/ratings",

  uploadAvatar: "/api/users/me/avatar",
  removeAvatar: "/api/users/me/avatar",

  clientMeProfile: "/api/clients/me/profile",

  // profile/settings
  me: "/api/users/me",
  updateMe: "/api/users/me",
  providerPublic: (id: string) => `/api/providers/${id}`,
providerSearch: "/api/providers/search",
};
