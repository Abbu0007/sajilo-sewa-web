"use client";

import { useRef, useState } from "react";
import { updateMe, uploadMyAvatar } from "@/lib/actions/client-actions";
import { toUploadsPath } from "@/lib/utils/media";
import NextImage from "next/image";

export default function EditClientProfileModal({
  me,
  onClose,
}: {
  me: any;
  onClose: () => void;
}) {
  const u = me?.user ?? me ?? {};

  const [firstName, setFirstName] = useState(u.firstName ?? "");
  const [lastName, setLastName] = useState(u.lastName ?? "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement | null>(null);

  async function save() {
    setSaving(true);
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
    try {
      await uploadMyAvatar(file);
      setMsg("Avatar updated. Refresh page.");
    } catch (e: any) {
      setMsg(e?.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200]">
      <div
        className="absolute inset-0 bg-black/55"
        onClick={onClose}
      />

      <div className="absolute inset-x-0 top-24 mx-auto w-[560px] max-w-[92vw]">
        <div className="rounded-2xl bg-white shadow-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="text-lg font-extrabold text-slate-900">
              Edit Profile
            </div>
            <button onClick={onClose}>✕</button>
          </div>

          <div className="space-y-4">
            <div className="h-24 w-24 rounded-2xl overflow-hidden bg-slate-100">
              {u.avatarUrl ? (
                <NextImage
                  src={toUploadsPath(u.avatarUrl)}
                  alt="avatar"
                  width={96}
                  height={96}
                  className="h-24 w-24 object-cover"
                  unoptimized
                />
              ) : null}
            </div>

            <input
              ref={fileRef}
              type="file"
              className="hidden"
              onChange={(e) => onPickAvatar(e.target.files?.[0])}
            />

            <button
              onClick={() => fileRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl"
            >
              Upload Avatar
            </button>

            <input
              className="w-full border rounded-xl px-3 py-2"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
            />

            <input
              className="w-full border rounded-xl px-3 py-2"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
            />

            <input
              className="w-full border rounded-xl px-3 py-2 bg-slate-100"
              value={u.email ?? ""}
              disabled
            />

            <input
              className="w-full border rounded-xl px-3 py-2 bg-slate-100"
              value={u.phone ?? ""}
              disabled
            />

            {msg && <div className="text-sm text-slate-600">{msg}</div>}

            <button
              onClick={save}
              disabled={saving}
              className="w-full py-2 bg-indigo-600 text-white rounded-xl"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}