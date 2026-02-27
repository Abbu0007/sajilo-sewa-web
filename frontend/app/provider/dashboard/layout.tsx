import { ReactNode } from "react";
import ProviderDashboardShell from "../_components/ui/ProviderDashboardShell"
import { providerGetMe, providerGetNotifications } from "@/lib/actions/provider-actions";

export default async function ProviderDashboardLayout({ children }: { children: ReactNode }) {
  const me = await providerGetMe().catch(() => null);
  const notifications = await providerGetNotifications().catch(() => []);
  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <ProviderDashboardShell me={me} notifications={notifications} unread={unread}>
      {children}
    </ProviderDashboardShell>
  );
}