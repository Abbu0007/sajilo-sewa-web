import SettingsClient from "./settings-client";
import { getMe } from "@/lib/actions/client-actions";

export default async function SettingsPage() {
  const me = await getMe();
  return <SettingsClient me={me} />;
}
