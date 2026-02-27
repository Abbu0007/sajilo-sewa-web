import ProfileClient from "./profile-client";
import { providerGetMe, providerGetProfile, providerGetEarnings } from "@/lib/actions/provider-actions";

export default async function ProviderProfilePage() {
  const me = await providerGetMe();
  const profile = await providerGetProfile();
  const earnings = await providerGetEarnings().catch(() => ({ total: 0 }));

  return <ProfileClient me={me} profile={profile} totalEarnings={earnings.total} />;
}