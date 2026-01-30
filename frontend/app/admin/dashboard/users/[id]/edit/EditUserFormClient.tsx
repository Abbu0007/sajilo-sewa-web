"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditUserFormClient({
  id,
  user,
}: {
  id: string;
  user: {
    firstName?: string;
    lastName?: string;
    role: "client" | "provider";
    profession?: string;
  };
}) {
  const router = useRouter();

  const [firstName, setFirstName] = useState(user.firstName ?? "");
  const [lastName, setLastName] = useState(user.lastName ?? "");
  const [role, setRole] = useState<"client" | "provider">(user.role);
  const [profession, setProfession] = useState(user.profession ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  
  useEffect(() => {
    if (role === "client") setProfession("");
  }, [role]);

  const canShowProfession = role === "provider";

  const apiBase = useMemo(() => {
    return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("firstName", firstName.trim());
      fd.append("lastName", lastName.trim());
      fd.append("role", role);

      
      if (role === "provider") {
        fd.append("profession", profession.trim()); 
      } else {
        fd.append("profession", ""); 
      }

      
      if (avatarFile && avatarFile.size > 0) {
        fd.append("avatar", avatarFile);
      }

      const token = document.cookie
        .split("; ")
        .find((x) => x.startsWith("ss_token="))
        ?.split("=")[1];

      if (!token) throw new Error("Not authenticated (token missing)");

      const res = await fetch(`${apiBase}/api/admin/users/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${decodeURIComponent(token)}`,
        },
        body: fd,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed (${res.status})`);
      }

      // ✅ navigate back
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
    <form className="mt-6 space-y-4" onSubmit={onSubmit}>
      {err && (
        <div className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700 ring-1 ring-rose-200">
          {err}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">First Name</label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Last Name</label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option value="client">Client</option>
            <option value="provider">Service Provider</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Profession (provider only)
          </label>
          <input
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            disabled={!canShowProfession}
            placeholder={canShowProfession ? "e.g., Electrician" : "Disabled for client"}
            className={`mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm ${
              !canShowProfession ? "bg-slate-50 text-slate-400" : ""
            }`}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">Avatar (optional)</label>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
        />
        <p className="mt-1 text-xs text-slate-500">Leave empty to keep current image.</p>
      </div>

      <button
        disabled={saving}
        className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
