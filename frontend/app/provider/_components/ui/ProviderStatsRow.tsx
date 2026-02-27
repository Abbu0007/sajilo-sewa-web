export default function ProviderStatsRow({
  pending,
  confirmed,
  inProgress,
  completed,
}: {
  pending: number;
  confirmed: number;
  inProgress: number;
  completed: number;
}) {
  const Card = ({ title, value }: { title: string; value: number }) => (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-5">
      <div className="text-sm font-semibold text-slate-600">{title}</div>
      <div className="mt-2 text-3xl font-extrabold text-slate-900">{value}</div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card title="Pending" value={pending} />
      <Card title="Confirmed" value={confirmed} />
      <Card title="In Progress" value={inProgress} />
      <Card title="Completed" value={completed} />
    </div>
  );
}