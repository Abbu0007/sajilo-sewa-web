"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateUserFormClient() {
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [role, setRole] = useState<"client" | "provider">("client");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const apiBase = useMemo(() => {
    return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setSaving(true);

    try {
      const form = e.currentTarget;

      const fd = new FormData(form);

      
      const r = String(fd.get("role") || "client") as "client" | "provider";
      if (r === "client") fd.set("profession", "");

      
      if (!avatarFile) {
        fd.delete("avatar");
      } else {
        fd.set("avatar", avatarFile);
      }

      
      const token = document.cookie
        .split("; ")
        .find((x) => x.startsWith("ss_token="))
        ?.split("=")[1];

      if (!token) throw new Error("Not authenticated (token missing)");

      const res = await fetch(`${apiBase}/api/admin/users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${decodeURIComponent(token)}`,
        },
        body: fd,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed (${res.status})`);
      }

      router.push("/admin/dashboard/users?role=client");
      router.refresh();
    } catch (e: any) {
      setErr(e?.message ?? "Create failed");
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
          <input name="firstName" required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Last Name</label>
          <input name="lastName" required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input name="email" type="email" required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Phone</label>
          <input name="phone" required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Role</label>
          <select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option value="client">Client</option>
            <option value="provider">Service Provider</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Profession (provider only)</label>
          <input
            name="profession"
            disabled={role !== "provider"}
            placeholder={role === "provider" ? "e.g., Electrician" : "Disabled for client"}
            className={`mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm ${
              role !== "provider" ? "bg-slate-50 text-slate-400" : ""
            }`}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Password</label>
          <input name="password" type="password" required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Avatar (optional)</label>
          <input
            type="file"
            name="avatar"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          />
        </div>
      </div>

      <button
        disabled={saving}
        className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {saving ? "Creating..." : "Create User"}
      </button>
    </form>
  );
}
