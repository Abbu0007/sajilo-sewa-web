import { cookies } from "next/headers";

const TOKEN_KEY = "ss_token";
const USER_KEY = "ss_user";

export type AuthUserCookie = {
  id?: string;
  email: string;
  role: "client" | "provider" | "admin";
  firstName?: string;
  lastName?: string;
  profession?: string;
  serviceSlug?: string;
  avatarUrl?: string;
};

function isProd() {
  return process.env.NODE_ENV === "production";
}

const commonOptions = {
  sameSite: "lax" as const,
  secure: isProd(),
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function setAuthCookies(token: string, user: AuthUserCookie) {
  const jar = await cookies();

  // ✅ Token cookie: httpOnly always
  jar.set(TOKEN_KEY, token, {
    ...commonOptions,
    httpOnly: true,
  });

  // ✅ User cookie: readable by client (httpOnly false)
  jar.set(USER_KEY, JSON.stringify(user), {
    ...commonOptions,
    httpOnly: false,
  });
}

export async function clearAuthCookies() {
  const jar = await cookies();

  // delete must match path
  jar.delete(TOKEN_KEY);
  jar.delete(USER_KEY);

  // (optional) in some Next versions, safer:
  // jar.set(TOKEN_KEY, "", { ...commonOptions, httpOnly: true, maxAge: 0 });
  // jar.set(USER_KEY, "", { ...commonOptions, httpOnly: false, maxAge: 0 });
}

export async function getAuthToken() {
  const jar = await cookies();
  return jar.get(TOKEN_KEY)?.value || "";
}

export async function getAuthUser(): Promise<AuthUserCookie | null> {
  const jar = await cookies();
  const raw = jar.get(USER_KEY)?.value;
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUserCookie;
  } catch {
    return null;
  }
}
