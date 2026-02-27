"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { ProviderItem } from "@/lib/actions/client-actions";
import { createBooking } from "@/lib/actions/client-actions";

export default function BookingModal({
  open,
  provider,
  serviceId,
  onClose,
}: {
  open: boolean;
  provider: ProviderItem | null;
  serviceId?: string;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [addressText, setAddressText] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !provider) return null;
  if (!mounted) return null;

  const p = provider;
  const canBook = !!serviceId;
  const isAddressValid = addressText.trim().length > 0;

  async function submit() {
    if (!scheduledAt) {
      setMsg("Please select date and time.");
      return;
    }

    if (!isAddressValid) {
      setMsg("Address is required.");
      return;
    }

    if (!serviceId) {
      setMsg("Service not found for this provider.");
      return;
    }

    setSaving(true);
    setMsg(null);

    try {
      await createBooking({
        providerId: p._id,
        serviceId,
        scheduledAt,
        addressText: addressText.trim(), 
        note: note.trim() || undefined,
      });

      setMsg("Booking request sent!");
      setTimeout(() => {
        setScheduledAt("");
        setAddressText("");
        setNote("");
        onClose();
      }, 700);
    } catch (e: any) {
      setMsg(e?.message ?? "Booking failed");
    } finally {
      setSaving(false);
    }
  }

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[9998] bg-black/45 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[9999] grid place-items-center p-4">
        <div
          className="w-full max-w-xl rounded-[26px] overflow-hidden border border-white/20 bg-white/90 backdrop-blur shadow-[0_30px_120px_rgba(2,6,23,0.40)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-extrabold text-slate-900">
                  Book Provider
                </div>
                <div className="text-sm text-slate-600">
                  {p.firstName} {p.lastName}
                </div>
              </div>

              <button
                onClick={onClose}
                className="h-10 w-10 rounded-2xl border bg-white hover:bg-slate-50 grid place-items-center"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-slate-700" />
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              {/* Date & Time */}
              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="mt-1 w-full h-12 rounded-2xl border px-4 bg-white outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              {/* Address (Required) */}
              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Address *
                </label>
                <input
                  value={addressText}
                  onChange={(e) => setAddressText(e.target.value)}
                  placeholder="Enter your full address"
                  className={`mt-1 w-full h-12 rounded-2xl border px-4 bg-white outline-none focus:ring-2 ${
                    !isAddressValid && msg
                      ? "border-rose-400 focus:ring-rose-300"
                      : "focus:ring-blue-300"
                  }`}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Notes (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Any extra notes..."
                  className="mt-1 w-full min-h-[90px] rounded-2xl border px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              {msg ? (
                <div className="text-sm text-rose-600 font-semibold">
                  {msg}
                </div>
              ) : null}

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={onClose}
                  className="h-11 rounded-2xl px-5 font-semibold border bg-white hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={submit}
                  disabled={
                    saving ||
                    !scheduledAt ||
                    !isAddressValid ||
                    !canBook
                  }
                  className="h-11 rounded-2xl px-6 font-extrabold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}