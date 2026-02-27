"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { X, QrCode, Wallet } from "lucide-react";
import { confirmBookingPayment } from "@/lib/actions/client-actions";

type Method = "cash" | "qr";

export default function PaymentModal({
  open,
  bookingId,
  amount,
  onClose,
  onPaid,
}: {
  open: boolean;
  bookingId: string;
  amount: number;
  onClose: () => void;
  onPaid: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [method, setMethod] = useState<Method>("cash");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const validAmount = useMemo(() => Number.isFinite(amount) && amount > 0, [amount]);

  if (!open) return null;
  if (!mounted) return null;

  async function confirmPay() {
    if (!validAmount) {
      setErr("Invalid amount.");
      return;
    }

    setSaving(true);
    setErr(null);
    try {
      await confirmBookingPayment(bookingId);
      onPaid();
    } catch (e: any) {
      setErr(e?.message ?? "Payment confirmation failed");
    } finally {
      setSaving(false);
    }
  }

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9998] bg-black/55 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[9999] grid place-items-center p-4">
        <div
          className="w-full max-w-xl rounded-[26px] overflow-hidden border border-white/20 bg-white/95 backdrop-blur shadow-[0_30px_120px_rgba(2,6,23,0.40)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-extrabold text-slate-900">Confirm Payment</div>
                <div className="text-sm text-slate-600">
                  Amount: <span className="font-extrabold text-slate-900">Rs {validAmount ? amount : 0}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="h-10 w-10 rounded-2xl border bg-white hover:bg-slate-50 grid place-items-center"
                aria-label="Close"
                type="button"
              >
                <X className="h-5 w-5 text-slate-700" />
              </button>
            </div>

            <div className="mt-5 grid gap-3">
              <button
                type="button"
                onClick={() => setMethod("cash")}
                className={[
                  "w-full rounded-2xl border p-4 text-left transition",
                  method === "cash"
                    ? "bg-emerald-50 border-emerald-200 ring-2 ring-emerald-200"
                    : "bg-white border-slate-200 hover:bg-slate-50",
                ].join(" ")}
              >
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-emerald-600 text-white grid place-items-center">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-extrabold text-slate-900">Cash</div>
                    <div className="text-sm text-slate-600">
                      Pay in cash after service. Tap confirm to mark as paid.
                    </div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMethod("qr")}
                className={[
                  "w-full rounded-2xl border p-4 text-left transition",
                  method === "qr"
                    ? "bg-indigo-50 border-indigo-200 ring-2 ring-indigo-200"
                    : "bg-white border-slate-200 hover:bg-slate-50",
                ].join(" ")}
              >
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-indigo-600 text-white grid place-items-center">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-extrabold text-slate-900">QR (eSewa / Khalti later)</div>
                    <div className="text-sm text-slate-600">
                      For now this confirms payment. Later we’ll show real QR + gateway verification.
                    </div>
                  </div>
                </div>
              </button>

              {method === "qr" ? (
                <div className="mt-1 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-extrabold text-slate-600">QR Preview</div>
                  <div className="mt-2 grid place-items-center rounded-2xl bg-white border border-slate-200 p-6">
                    <div className="h-40 w-40 rounded-2xl border border-dashed border-slate-300 grid place-items-center text-slate-500 font-bold">
                      QR here later
                    </div>
                  </div>
                </div>
              ) : null}

              {err ? <div className="text-sm text-rose-600 font-semibold">{err}</div> : null}

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  onClick={onClose}
                  className="h-11 rounded-2xl px-5 font-semibold border bg-white hover:bg-slate-50"
                  disabled={saving}
                  type="button"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmPay}
                  disabled={saving || !validAmount}
                  className="h-11 rounded-2xl px-6 font-extrabold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                  type="button"
                >
                  {saving ? "Confirming..." : "Confirm paid"}
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