import { cn } from "./cn";

export default function GlassCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/35 bg-white/65 backdrop-blur-xl shadow-[0_20px_80px_rgba(15,23,42,0.12)]",
        className
      )}
    >
      {children}
    </div>
  );
}
