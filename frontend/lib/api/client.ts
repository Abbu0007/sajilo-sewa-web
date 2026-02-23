import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

async function getTokenFromCookies() {
  const store = await cookies();

  const token =
    store.get("ss_token")?.value ||
    store.get("token")?.value ||
    store.get("accessToken")?.value ||
    store.get("authToken")?.value ||
    "";

  return token;
}

async function parseJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

function getErrorMessage(data: any) {
  return (
    data?.message ||
    data?.error ||
    (typeof data === "string" ? data : "") ||
    "Request failed"
  );
}

export async function apiGet<T>(path: string, auth: boolean = false): Promise<T> {
  const token = auth ? await getTokenFromCookies() : "";

  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error(getErrorMessage(data));
  return data as T;
}

export async function apiPost<T>(
  path: string,
  body: any,
  auth: boolean = false
): Promise<T> {
  const token = auth ? await getTokenFromCookies() : "";

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error(getErrorMessage(data));
  return data as T;
}

export async function apiPatch<T>(
  path: string,
  body: any,
  auth: boolean = false
): Promise<T> {
  const token = auth ? await getTokenFromCookies() : "";

  const res = await fetch(`${API_BASE}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error(getErrorMessage(data));
  return data as T;
}

export async function apiDelete<T>(path: string, auth: boolean = false): Promise<T> {
  const token = auth ? await getTokenFromCookies() : "";

  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error(getErrorMessage(data));
  return data as T;
}


export async function apiPostForm<T>(
  path: string,
  formData: FormData,
  auth: boolean = false
): Promise<T> {
  const token = auth ? await getTokenFromCookies() : "";

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
    cache: "no-store",
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error(getErrorMessage(data));
  return data as T;
}