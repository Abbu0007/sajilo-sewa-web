"use client";

import { useState } from "react";
import { providerCreateRating } from "@/lib/actions/provider-actions";

export default function RatingModal({
  bookingId,
  onClose,
  onSubmitted,
}: {
  bookingId: string;
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-[120]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[520px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <div className="font-semibold text-slate-900">Rate Client</div>
          <button className="text-slate-500 hover:text-slate-900" onClick={onClose}>✕</button>
        </div>

        <div className="p-5 space-y-4">
          {err && <div className="rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{err}</div>}

          <div className="flex gap-2">
            {[1,2,3,4,5].map((n) => (
              <button
                key={n}
                className={[
                  "h-10 w-10 rounded-xl font-bold",
                  n <= stars ? "bg-amber-400 text-white" : "bg-slate-100 text-slate-500",
                ].join(" ")}
                onClick={() => setStars(n)}
              >
                {n}
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Write a short review (optional)"
          />

          <button
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
            onClick={async () => {
              setLoading(true);
              setErr(null);
              try {
                await providerCreateRating({ bookingId, stars, comment });
                onSubmitted();
              } catch (e: any) {
                setErr(e?.message || "Failed to submit rating");
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Submitting..." : "Submit Rating"}
          </button>
        </div>
      </div>
    </div>
  );
}