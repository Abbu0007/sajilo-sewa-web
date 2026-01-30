export const ENDPOINTS = {
  // existing
  login: "/api/auth/login",
  register: "/api/auth/register",

  // ✅ admin users
  adminUsers: "/api/admin/users",
  adminUserById: (id: string) => `/api/admin/users/${id}`,
};
