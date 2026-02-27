import NotificationBell from "../modals/BaseModal";
import { providerGetMe, providerGetNotifications } from "@/lib/actions/provider-actions";

export default async function ProviderTopbar() {
  const me = await providerGetMe().catch(() => null);
  const notifs = await providerGetNotifications().catch(() => []);
  const unread = notifs.filter((n) => !n.isRead).length;

  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 px-6 py-4 flex items-center justify-between">
      <div>
        <div className="text-lg font-semibold text-slate-900">
          Welcome, {me?.firstName || "Provider"} !!!
        </div>
        <div className="text-sm text-slate-500">
          Manage bookings, update statuses, and track ratings.
        </div>
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell unread={unread} notifications={notifs} />
      </div>
    </div>
  );
}