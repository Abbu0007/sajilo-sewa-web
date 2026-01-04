export type UserRole = "client" | "provider" | "admin";

export type PublicUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  profession?: string;
};
