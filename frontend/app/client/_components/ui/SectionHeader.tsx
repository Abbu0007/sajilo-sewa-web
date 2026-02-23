import { cn } from "./cn";

export default function SectionHeader({
  title,
  subtitle,
  description,
  right,
  className,
}: {
  title: string;
  subtitle?: string;
  description?: string; 
  right?: React.ReactNode;
  className?: string;
}) {
  const sub = subtitle ?? description;

  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div>
        <div className="text-base sm:text-lg font-extrabold text-slate-900">{title}</div>
        {sub ? <div className="mt-1 text-sm text-slate-600">{sub}</div> : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}
