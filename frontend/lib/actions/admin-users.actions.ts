"use server";

import { cookies } from "next/headers";
import { ENDPOINTS } from "@/lib/api/endpoints";

const API_BASE = "http://localhost:5000";

async function getToken() {
  const jar = await cookies();
  return jar.get("ss_token")?.value;
}

function stripHtml(input: string) {
  return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

async function readError(res: Response) {
  
  try {
    const data = await res.json();
    if (data?.message) return `${res.status} ${data.message}`;
    return `${res.status} ${JSON.stringify(data)}`;
  } catch {
    
    try {
      const text = await res.text();
      const cleaned = stripHtml(text).slice(0, 300);
      return `${res.status} ${cleaned || "Request failed"}`;
    } catch {
      return `${res.status} Request failed`;
    }
  }
}

async function apiFetch(path: string, init?: RequestInit) {
  const token = await getToken();
  if (!token) throw new Error("401 Not authenticated (ss_token missing)");

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const msg = await readError(res);
    // ✅ log into terminal so you can see the exact backend failure
    console.error("[ADMIN API ERROR]", path, msg);
    throw new Error(msg);
  }

  return res.json();
}

export async function adminListUsers() {
  return apiFetch(ENDPOINTS.adminUsers);
}

export async function adminGetUser(id: string) {
  return apiFetch(ENDPOINTS.adminUserById(id));
}

export async function adminDeleteUser(id: string) {
  return apiFetch(ENDPOINTS.adminUserById(id), { method: "DELETE" });
}

export async function adminCreateUser(formData: FormData) {
  return apiFetch(ENDPOINTS.adminUsers, { method: "POST", body: formData });
}

export async function adminUpdateUser(id: string, formData: FormData) {
  return apiFetch(ENDPOINTS.adminUserById(id), { method: "PUT", body: formData });
}
