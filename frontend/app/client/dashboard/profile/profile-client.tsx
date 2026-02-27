"use client";

import { useState } from "react";
import NextImage from "next/image";
import { toUploadsPath } from "@/lib/utils/media";
import { logoutAction } from "@/lib/actions/auth-actions";
import EditClientProfileModal from "../../_components/modals/EditClientProfileModals";

export default function ProfileClient({
  me,
  profile,
}: {
  me: any;
  profile: any;
}) {
  const u = me?.user ?? me ?? {};
  const [openEdit, setOpenEdit] = useState(false);

  const rating = (profile?.ratingAvg ?? 0).toFixed(1);
  const ratingCount = profile?.ratingCount ?? 0;
  const completed = profile?.completedBookings ?? 0;

  return (
    <div className="space-y-6">
      {/* HEADER */}
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
            {u.avatarUrl ? (
              <NextImage
                src={toUploadsPath(u.avatarUrl)}
                alt="avatar"
                width={96}
                height={96}
                className="h-24 w-24 object-cover"
                unoptimized
              />
            ) : (
              <div className="h-24 w-24 grid place-items-center text-2xl font-extrabold">
                {(u.firstName?.[0] ?? "U").toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <div className="text-xl font-extrabold">
              {u.firstName} {u.lastName}
            </div>
            <div className="text-sm text-white/85">{u.phone || ""}</div>
            <div className="text-sm text-white/85">{u.email || ""}</div>
            <div className="text-xs text-white/75 mt-1">Client Account</div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6 text-center">
          <div className="text-3xl font-extrabold text-blue-600">
            {completed}
          </div>
          <div className="text-sm font-semibold text-slate-600 mt-1">
            Completed Bookings
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6 text-center">
          <div className="text-3xl font-extrabold text-amber-500">
            {rating}
          </div>
          <div className="text-sm font-semibold text-slate-600 mt-1">
            Rating
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6 text-center">
          <div className="text-3xl font-extrabold text-indigo-600">
            {ratingCount}
          </div>
          <div className="text-sm font-semibold text-slate-600 mt-1">
            Total Reviews
          </div>
        </div>
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

      {openEdit && (
        <EditClientProfileModal
          me={me}
          onClose={() => setOpenEdit(false)}
        />
      )}
    </div>
  );
}