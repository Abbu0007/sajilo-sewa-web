import { redirect } from "next/navigation";
import { getAuthToken, getAuthUser } from "@/lib/cookie";

export default async function HomePage() {
  const token = await getAuthToken();
  const user = await getAuthUser();

  
  if (token && user?.role) {
    if (user.role === "admin") redirect("/admin");
    if (user.role === "provider") redirect("/provider/dashboard");
    return redirect("/client/dashboard");
  }

  
  redirect("/login");
}