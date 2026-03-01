"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { adminCreateUser } from "@/lib/actions/admin-users.actions";

type ServiceItem = {
  _id?: string;
  id?: string;
  name?: string;
  slug?: string;
  status?: string;
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function CreateUserFormClient() {
  const router = useRouter();

  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [role, setRole] = useState<"client" | "provider">("client");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [profession, setProfession] = useState("");
  const [serviceSlug, setServiceSlug] = useState("");

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);

  const apiBase = useMemo(() => {
    return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
  }, []);

  useEffect(() => {
    let alive = true;

    async function loadServices() {
      setServicesLoading(true);
      try {
        const res = await fetch(`${apiBase}/api/services`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load services (${res.status})`);
        const data = await res.json();
        const items: ServiceItem[] = Array.isArray(data?.items) ? data.items : [];

        const active = items.filter((s) => (s.status ?? "active") === "active");
        if (alive) setServices(active);
      } catch (e) {
        if (alive) setServices([]);
      } finally {
        if (alive) setServicesLoading(false);
      }
    }

    loadServices();
    return () => {
      alive = false;
    };
  }, [apiBase]);

  useEffect(() => {
    if (role === "client") {
      setProfession("");
      setServiceSlug("");
    }
  }, [role]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);

    const form = e.currentTarget;

    const firstName = String((form.elements.namedItem("firstName") as HTMLInputElement)?.value ?? "").trim();
    const lastName = String((form.elements.namedItem("lastName") as HTMLInputElement)?.value ?? "").trim();
    const email = String((form.elements.namedItem("email") as HTMLInputElement)?.value ?? "").trim();
    const phone = String((form.elements.namedItem("phone") as HTMLInputElement)?.value ?? "").trim();
    const password = String((form.elements.namedItem("password") as HTMLInputElement)?.value ?? "").trim();

    if (!firstName || !lastName || !email || !phone || !password) {
      setErr("Please fill all required fields.");
      return;
    }

    if (role === "provider") {
      if (!serviceSlug.trim()) {
        setErr("Please select a service for the provider.");
        return;
      }
    }

    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("firstName", firstName);
      fd.append("lastName", lastName);
      fd.append("email", email);
      fd.append("phone", phone);
      fd.append("password", password);
      fd.append("role", role);

      if (role === "provider") {
        fd.append("profession", profession.trim());
        fd.append("serviceSlug", serviceSlug.trim());
      } else {
        fd.append("profession", "");
        fd.append("serviceSlug", "");
      }

      if (avatarFile && avatarFile.size > 0) {
        fd.append("avatar", avatarFile);
      }

      await adminCreateUser(fd);

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
          <input
            name="firstName"
            required
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Last Name</label>
          <input
            name="lastName"
            required
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Phone</label>
          <input
            name="phone"
            required
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
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
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            disabled={role !== "provider"}
            placeholder={role === "provider" ? "e.g., Electrician" : "Disabled for client"}
            className={cn(
              "mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm",
              role !== "provider" && "bg-slate-50 text-slate-400"
            )}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Service (provider only)</label>
          <select
            value={serviceSlug}
            onChange={(e) => setServiceSlug(e.target.value)}
            disabled={role !== "provider" || servicesLoading}
            className={cn(
              "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm",
              role !== "provider" && "bg-slate-50 text-slate-400"
            )}
          >
            <option value="">
              {role !== "provider"
                ? "Disabled for client"
                : servicesLoading
                  ? "Loading services..."
                  : "Select a service"}
            </option>
            {services.map((s) => (
              <option key={String(s._id ?? s.id ?? s.slug)} value={String(s.slug ?? "")}>
                {String(s.name ?? s.slug ?? "Service")}
              </option>
            ))}
          </select>
          {role === "provider" && !servicesLoading && services.length === 0 ? (
            <div className="mt-1 text-xs text-rose-600">
              No services found. Check GET /api/services.
            </div>
          ) : null}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Password</label>
          <input
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
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
        <div className="hidden sm:block" />
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