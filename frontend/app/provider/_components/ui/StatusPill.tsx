export default function StatusPill({ status }: { status: string }) {
  const s = (status || "pending").toString();

  const map: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-blue-100 text-blue-800",
    in_progress: "bg-purple-100 text-purple-800",
    awaiting_payment_confirmation: "bg-indigo-100 text-indigo-800",
    completed: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-rose-100 text-rose-800",
    rejected: "bg-rose-100 text-rose-800",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
        map[s] || "bg-slate-100 text-slate-700"
      }`}
    >
      {s.replaceAll("_", " ")}
    </span>
  );
}