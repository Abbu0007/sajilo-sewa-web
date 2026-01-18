import { http } from "@/lib/api/axios";
import { ENDPOINTS } from "@/lib/api/endpoints";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string; // 10 digits only
  role: "client" | "provider";
  profession?: string;
  password: string;
};

export async function loginApi(payload: LoginPayload) {
  const res = await http.post(ENDPOINTS.login, payload);
  return res.data; // { token, user }
}

export async function registerApi(payload: RegisterPayload) {
  const res = await http.post(ENDPOINTS.register, payload);
  return res.data; // { token, user }
}
