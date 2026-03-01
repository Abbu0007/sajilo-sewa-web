"use client";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function StatusPill({ status }: { status: string }) {
  const s = String(status ?? "").toLowerCase();

  const cls =
    s === "completed"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : s === "cancelled" || s === "rejected"
      ? "bg-rose-50 text-rose-700 ring-rose-200"
      : s === "awaiting_payment_confirmation"
      ? "bg-amber-50 text-amber-700 ring-amber-200"
      : s === "in_progress"
      ? "bg-purple-50 text-purple-700 ring-purple-200"
      : s === "confirmed"
      ? "bg-indigo-50 text-indigo-700 ring-indigo-200"
      : "bg-slate-50 text-slate-700 ring-slate-200";

  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-extrabold ring-1", cls)}>
      {status}
    </span>
  );
}