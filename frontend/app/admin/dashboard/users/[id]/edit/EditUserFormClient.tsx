"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { adminUpdateUser } from "@/lib/actions/admin-users.actions";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function initials(first?: string, last?: string) {
  const a = String(first ?? "").trim().charAt(0);
  const b = String(last ?? "").trim().charAt(0);
  const v = `${a}${b}`.toUpperCase();
  return v || "U";
}

export default function EditUserFormClient({
  id,
  user,
}: {
  id: string;
  user: {
    firstName?: string;
    lastName?: string;
    role: "client" | "provider" | "admin";
    profession?: string;
    serviceSlug?: string;
    avatarUrl?: string;
    email?: string;
    phone?: string;
  };
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [firstName, setFirstName] = useState(user.firstName ?? "");
  const [lastName, setLastName] = useState(user.lastName ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(user.avatarUrl ?? "");

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const role = user.role === "provider" ? "provider" : user.role === "client" ? "client" : "admin";
  const isProvider = role === "provider";

  const email = user.email ?? "";
  const phone = user.phone ?? "";
  const profession = user.profession ?? "";
  const serviceSlug = user.serviceSlug ?? "";

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  function onPickAvatar(file?: File) {
    if (!file) return;
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setSaving(true);

    try {
      const fd = new FormData();

      fd.append("firstName", firstName.trim());
      fd.append("lastName", lastName.trim());

      if (avatarFile && avatarFile.size > 0) {
        fd.append("avatar", avatarFile);
      }
      await adminUpdateUser(id, fd);

      setMsg("Saved successfully.");
      router.push(`/admin/dashboard/users/${id}`);
      router.refresh();
    } catch (e: any) {
      setErr(e?.message ?? "Update failed");
      setSaving(false);
      return;
    }

    setSaving(false);
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      {err && (
        <div className="rounded-2xl bg-rose-50 p-3 text-sm font-semibold text-rose-700 ring-1 ring-rose-200">
          {err}
        </div>
      )}

      {msg && (
        <div className="rounded-2xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">
          {msg}
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-24 w-24 rounded-2xl overflow-hidden ring-1 ring-slate-200 bg-slate-100 flex-shrink-0">
            {avatarPreview ? (
              <img src={avatarPreview} alt="avatar" className="h-24 w-24 object-cover" />
            ) : (
              <div className="h-full w-full grid place-items-center text-lg font-extrabold text-slate-600">
                {initials(firstName, lastName)}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="text-sm font-extrabold text-slate-900 truncate">
              {`${firstName} ${lastName}`.trim() || "User"}
            </div>
            <div className="text-xs text-slate-500 truncate">{email || "—"}</div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1",
                  role === "client"
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : role === "provider"
                    ? "bg-indigo-50 text-indigo-700 ring-indigo-200"
                    : "bg-slate-100 text-slate-700 ring-slate-200"
                )}
              >
                {role}
              </span>

              {isProvider ? (
                <span className="text-xs font-semibold text-slate-500">
                  Provider can only change name & photo
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex gap-2 sm:justify-end">
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => onPickAvatar(e.target.files?.[0])}
          />

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="h-11 rounded-2xl bg-slate-100 px-5 text-sm font-semibold text-slate-900 hover:bg-slate-200"
          >
            Change photo
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Field label="First Name" value={firstName} onChange={setFirstName} />
        <Field label="Last Name" value={lastName} onChange={setLastName} />

        <LockedField label="Role" value={role} />
        <LockedField label="Email" value={email || "—"} />
        <LockedField label="Phone" value={phone || "—"} />

        <Field
          label="Profession"
          value={profession}
          onChange={() => {}}
          disabled
          placeholder="Locked"
        />

        <Field
          label="Service Slug"
          value={serviceSlug}
          onChange={() => {}}
          disabled
          placeholder="Locked"
        />
      </div>

      <button
        disabled={saving}
        className="w-full h-12 rounded-2xl bg-indigo-600 text-white font-extrabold hover:bg-indigo-700 disabled:opacity-60 ring-1 ring-black/5"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>

      <div className="text-xs text-slate-500">
        Avatar is optional. If you don’t upload, the existing avatar stays.
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <div className="text-xs font-bold text-slate-700 mb-1">{label}</div>
      <input
        className={cn(
          "w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500",
          disabled && "bg-slate-100 text-slate-500"
        )}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
      />
    </div>
  );
}

function LockedField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-bold text-slate-700 mb-1">{label}</div>
      <div className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-3 py-3 text-sm text-slate-600 flex items-center gap-2">
        <span>🔒</span>
        <span className="truncate">{value}</span>
      </div>
    </div>
  );
}