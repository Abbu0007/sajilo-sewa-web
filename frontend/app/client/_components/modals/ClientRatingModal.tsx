"use client";

import { useMemo, useState } from "react";
import { createRating } from "@/lib/actions/client-actions";

export default function ClientRatingModal({
  bookingId,
  onClose,
  onSubmitted,
}: {
  bookingId: string;
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const [stars, setStars] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const starRow = useMemo(() => {
    return [1, 2, 3, 4, 5].map((s) => {
      const active = s <= stars;
      return (
        <button
          key={s}
          type="button"
          onClick={() => setStars(s)}
          className={[
            "h-10 w-10 rounded-xl grid place-items-center font-extrabold transition",
            "border",
            active
              ? "bg-amber-400 border-amber-400 text-white"
              : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200",
          ].join(" ")}
          aria-label={`${s} star`}
        >
          {s}
        </button>
      );
    });
  }, [stars]);

  async function submit() {
    setErr(null);
    setSaving(true);
    try {
      await createRating({ bookingId, stars, comment });
      onSubmitted();
    } catch (e: any) {
      setErr(e?.message ?? "Request failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200]">
      <div
        className="absolute inset-0 bg-black/55"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="absolute inset-x-0 top-20 mx-auto w-[560px] max-w-[92vw]">
        <div className="rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
          {/* header */}
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <div className="font-extrabold text-slate-900">Rate the Provider</div>
              <div className="text-sm text-slate-500">
                Select stars and optionally leave a short comment.
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-9 w-9 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition grid place-items-center text-slate-700"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* body */}
          <div className="px-5 py-5">
            <div className="flex items-center gap-2">{starRow}</div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a short review (optional)"
              className="mt-4 w-full min-h-[120px] rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/30"
            />

            {err ? (
              <div className="mt-3 text-sm text-rose-600 font-semibold">{err}</div>
            ) : null}
          </div>

          {/* footer */}
          <div className="px-5 pb-5 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="h-11 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition text-sm font-semibold text-slate-700 disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={submit}
              disabled={saving}
              className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-sm font-extrabold text-white shadow disabled:opacity-60"
            >
              {saving ? "Submitting..." : "Submit rating"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}