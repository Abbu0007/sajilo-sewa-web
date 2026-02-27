"use client";
import NextImage from "next/image";
import { useEffect, useState } from "react";
import { ProviderMe, ProviderProfile } from "@/lib/types/provider";
import { providerUpdateMe, providerUpdateProfile, providerUploadAvatar } from "@/lib/actions/provider-actions";
import { toUploadsPath } from "@/lib/utils/media";

export default function EditProfileModal({
  me,
  profile,
  onClose,
}: {
  me: ProviderMe;
  profile: ProviderProfile | null;
  onClose: () => void;
}) {
  const [firstName, setFirstName] = useState(me.firstName);
  const [lastName, setLastName] = useState(me.lastName);
  const [startingPrice, setStartingPrice] = useState(String(profile?.startingPrice ?? 500));
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const profession = (me.profession || "").trim();
  const email = me.email || "";
  const phone = me.phone || "";

  return (
    <div className="fixed inset-0 z-[120]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[640px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <div className="font-semibold text-slate-900">Edit Profile</div>
          <button className="text-slate-500 hover:text-slate-900" onClick={onClose}>✕</button>
        </div>

        <div className="p-5 space-y-4">
          {err && <div className="rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{err}</div>}
          <div className="flex items-center gap-4">
            <div className="h-24 w-24 rounded-2xl overflow-hidden ring-4 ring-white/40 shadow-xl flex-shrink-0 bg-white/20 backdrop-blur">
              <NextImage
                src={me.avatarUrl ? toUploadsPath(me.avatarUrl) : "/avatar.png"}
                alt="avatar"
                width={96}
                height={96}
                className="h-24 w-24 object-cover"
                unoptimized
              />
            </div>

            <label className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-slate-200">
              Change photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setLoading(true);
                  setErr(null);
                  try {
                    await providerUploadAvatar(file);
                    window.location.reload();
                  } catch (e: any) {
                    setErr(e?.message || "Avatar upload failed");
                  } finally {
                    setLoading(false);
                  }
                }}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="First Name" value={firstName} onChange={setFirstName} />
            <Field label="Last Name" value={lastName} onChange={setLastName} />
            <LockedField label="Profession" value={profession} />
            <LockedField label="Email" value={email} />
            <LockedField label="Phone" value={phone} />
            <Field label="Starting Price (Rs/hr)" value={startingPrice} onChange={setStartingPrice} />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
            onClick={async () => {
              setLoading(true);
              setErr(null);
              try {
                await providerUpdateMe({ firstName: firstName.trim(), lastName: lastName.trim() });

                const priceNum = Number(startingPrice);
                await providerUpdateProfile({
                  profession: profession || (profile?.profession ?? ""),
                  startingPrice: Number.isFinite(priceNum) ? priceNum : 500,
                });

                window.location.reload();
              } catch (e: any) {
                setErr(e?.message || "Update failed");
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="text-xs font-bold text-slate-700 mb-1">{label}</div>
      <input
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function LockedField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-bold text-slate-700 mb-1">{label}</div>
      <div className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-3 text-sm text-slate-600 flex items-center gap-2">
        <span>🔒</span>
        <span className="truncate">{value}</span>
      </div>
    </div>
  );
}