import { cn } from "./cn";

export default function EmptyState({
  title,
  subtitle,
  description,
  className,
}: {
  title: string;
  subtitle?: string;
  description?: string; 
  className?: string;
}) {
  const text = subtitle ?? description;

  return (
    <div className={cn("rounded-2xl border border-white/35 bg-white/60 p-8 text-center", className)}>
      <div className="text-lg font-extrabold text-slate-900">{title}</div>
      {text ? <div className="mt-2 text-sm text-slate-600">{text}</div> : null}
    </div>
  );
}
