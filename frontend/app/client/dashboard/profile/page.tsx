import { getMe, getClientProfile } from "@/lib/actions/client-actions";
import ProfileClient from "./profile-client";


export default async function ClientProfilePage() {
  const me = await getMe();
  const profileRes = await getClientProfile();

  return (
    <ProfileClient
      me={me}
      profile={profileRes?.profile ?? null}
    />
  );
}