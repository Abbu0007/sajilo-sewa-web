"use client";

import { useRef, useState } from "react";
import GlassCard from "@/app/client/_components/ui/GlassCard";
import SectionHeader from "@/app/client/_components/ui/SectionHeader";
import Input from "@/app/client/_components/ui/Input";
import Button from "@/app/client/_components/ui/Button";
import Image from "next/image";
import { updateMe, uploadMyAvatar } from "@/lib/actions/client-actions";
import { toProxyUploadsUrl } from "@/lib/utils/media";

export default function SettingsClient({ me }: any) {
  const u = me?.user ?? {};
  const [firstName, setFirstName] = useState(u.firstName ?? "");
  const [lastName, setLastName] = useState(u.lastName ?? "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      await updateMe({ firstName, lastName });
      setMsg("Saved successfully.");
    } catch (e: any) {
      setMsg(e?.message ?? "Update failed");
    } finally {
      setSaving(false);
    }
  }

  async function onPickAvatar(file?: File) {
    if (!file) return;
    setUploading(true);
    setMsg(null);
    try {
      await uploadMyAvatar(file);
      setMsg("Avatar updated. Refresh page to see new image.");
      // if you want auto-refresh:
      window.location.reload();
    } catch (e: any) {
      setMsg(e?.message ?? "Avatar upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <GlassCard className="p-5 sm:p-6">
        <SectionHeader
          title="Account Settings"
          description="Update your name and profile picture. Email & phone are locked."
        />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Avatar */}
          <div className="rounded-3xl border border-white/35 bg-white/60 p-6 shadow-[0_16px_60px_rgba(2,6,23,0.06)]">
            <div className="text-sm font-extrabold text-slate-900">Profile Picture</div>

            <div className="mt-4 h-32 w-32 rounded-[28px] overflow-hidden border border-white/35 bg-white/70">
              {u.avatarUrl ? (
                <Image src={toProxyUploadsUrl(u.avatarUrl)}
                alt="Avatar"
                width={128}
                height={128}
                className="h-32 w-32 object-cover"/>
                
              ) : (
                <div className="h-32 w-32 grid place-items-center font-extrabold text-slate-700 text-3xl">
                  {(u.firstName?.[0] ?? "U").toUpperCase()}
                </div>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => onPickAvatar(e.target.files?.[0])}
            />

            <div className="mt-5 flex items-center gap-3">
              <Button onClick={() => fileRef.current?.click()} isLoading={uploading}>
                Upload Avatar
              </Button>
              <div className="text-xs text-slate-500">jpg / png / webp</div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <Input label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Email (locked)" value={u.email ?? ""} disabled />
              <Input label="Phone (locked)" value={u.phone ?? ""} disabled />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-slate-700">{msg ?? ""}</div>
              <Button onClick={save} isLoading={saving}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}