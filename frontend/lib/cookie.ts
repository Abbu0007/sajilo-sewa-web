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
};

export async function setAuthCookies(token: string, user: AuthUserCookie) {
  const jar = await cookies(); // ✅ FIX (await)

  jar.set(TOKEN_KEY, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  jar.set(USER_KEY, JSON.stringify(user), {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookies() {
  const jar = await cookies(); // ✅ FIX (await)
  jar.delete(TOKEN_KEY);
  jar.delete(USER_KEY);
}
