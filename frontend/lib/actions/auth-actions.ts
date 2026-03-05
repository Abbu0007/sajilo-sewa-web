"use server";

import { loginApi, registerApi } from "@/lib/api/auth";
import { setAuthCookies } from "@/lib/cookie";
import { clearAuthCookies } from "@/lib/cookie";

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
  serviceSlug?: string;
  password: string;
}) {
  const payload = {
    ...values,
    email: values.email.trim(),
    phone: values.phone.replace(/\D/g, "").slice(-10),
    profession: values.role === "provider" ? values.profession?.trim() : undefined,
    serviceSlug: values.role === "provider" ? values.serviceSlug?.trim() : undefined,
  };

  const data = await registerApi(payload);

  if (data?.token && data?.user) {
    await setAuthCookies(data.token, data.user);
  }

  return data;
}

export async function logoutAction() {
  await clearAuthCookies();
  return { ok: true };
}

export async function forgotPasswordAction(payload: { email: string }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: payload.email.trim() }),
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to send reset code");
  return data;
}

export async function resetPasswordAction(payload: { email: string; otp: string; newPassword: string }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: payload.email.trim(),
      otp: payload.otp.trim(),
      newPassword: payload.newPassword,
    }),
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to reset password");
  return data;
}

// ✅ NEW: verify email
export async function verifyEmailAction(payload: { email: string; otp: string }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: payload.email.trim(),
      otp: payload.otp.trim(),
    }),
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to verify email");
  return data;
}


export async function resendVerificationAction(payload: { email: string }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: payload.email.trim() }),
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to resend code");
  return data;
}