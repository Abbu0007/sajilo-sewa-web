"use server";

import { loginApi, registerApi } from "@/lib/api/auth";
import { setAuthCookies } from "@/lib/cookie";

export async function loginAction(values: { email: string; password: string }) {
  const data = await loginApi({
    email: values.email.trim(),
    password: values.password,
  });

  if (data?.token && data?.user) {
    await setAuthCookies(data.token, data.user); 
  }

  return data;
}

export async function registerAction(values: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "client" | "provider";
  profession?: string;
  password: string;
}) {
  const payload = {
    ...values,
    email: values.email.trim(),
    phone: values.phone.replace(/\D/g, "").slice(-10),
    profession: values.role === "provider" ? values.profession?.trim() : undefined,
  };

  const data = await registerApi(payload);

  if (data?.token && data?.user) {
    await setAuthCookies(data.token, data.user); 
  }

  return data;
}
