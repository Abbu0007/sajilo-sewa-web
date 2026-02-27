"use client";

import { useMemo, useState } from "react";
import NextImage from "next/image";
import { ProviderMe, ProviderProfile } from "@/lib/types/provider";
import EditProfileModal from "../../_components/modals/EditProfileModal";
import { logoutAction } from "@/lib/actions/auth-actions";
import { toUploadsPath } from "@/lib/utils/media";

export default function ProfileClient({
  me,
  profile,
  totalEarnings,
}: {
  me: ProviderMe;
  profile: ProviderProfile | null;
  totalEarnings: number;
}) {
  const [openEdit, setOpenEdit] = useState(false);

  const bookings = profile?.completedJobs ?? 0;
  const rating = (profile?.ratingAvg ?? 0).toFixed(1);

  const earningsText = useMemo(() => {
    const v = Number(totalEarnings ?? 0);
    return v.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }, [totalEarnings]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-6 top-6">
          <button
            className="rounded-xl bg-white/15 px-4 py-2 font-semibold hover:bg-white/20"
            onClick={() => setOpenEdit(true)}
          >
            ⚙ Edit
          </button>
        </div>

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

          <div>
            <div className="text-xl font-extrabold">
              {me.firstName} {me.lastName}
            </div>
            <div className="text-sm text-white/85">{me.phone || ""}</div>
            <div className="text-sm text-white/85">{me.email || ""}</div>
            <div className="text-xs text-white/75 mt-1">{me.profession || ""}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6 text-center">
          <div className="text-3xl font-extrabold text-blue-600">{bookings}</div>
          <div className="text-sm font-semibold text-slate-600 mt-1">Completed Jobs</div>
        </div>

        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6 text-center">
          <div className="text-3xl font-extrabold text-amber-500">{rating}</div>
          <div className="text-sm font-semibold text-slate-600 mt-1">Rating</div>
        </div>

        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6 text-center">
          <div className="text-3xl font-extrabold text-emerald-600">Rs. {earningsText}</div>
          <div className="text-sm font-semibold text-slate-600 mt-1">Total Earnings</div>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6 space-y-3">
        <div className="text-sm font-bold text-slate-700">Support & Legal</div>

        <button className="w-full rounded-xl bg-slate-50 px-4 py-3 text-left font-semibold text-slate-700 hover:bg-slate-100">
          Terms of Service
        </button>

        <button className="w-full rounded-xl bg-slate-50 px-4 py-3 text-left font-semibold text-slate-700 hover:bg-slate-100">
          Privacy Policy
        </button>
      </div>

      <button
        className="w-full rounded-xl border border-rose-200 bg-white px-4 py-3 font-extrabold text-rose-600 hover:bg-rose-50"
        onClick={async () => {
          await logoutAction();
          window.location.href = "/login";
        }}
      >
        Logout
      </button>

      {openEdit && <EditProfileModal me={me} profile={profile} onClose={() => setOpenEdit(false)} />}
    </div>
  );
}