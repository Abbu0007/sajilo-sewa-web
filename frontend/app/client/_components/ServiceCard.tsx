import Link from "next/link";
import Image from "next/image";
import GlassCard from "./ui/GlassCard";

export default function ServiceCard({
  name,
  slug,
  basePriceFrom,
}: {
  name: string;
  slug: string;
  basePriceFrom?: number;
}) {
  return (
    <Link href={`/client/dashboard/services/${slug}`} className="group">
      <GlassCard className="p-4 hover:shadow-[0_30px_120px_rgba(2,6,23,0.18)] transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-white/70 border border-white/35 overflow-hidden grid place-items-center">
            <Image
              src={`/${slug}.png`}
              alt={name}
              width={48}
              height={48}
              className="h-12 w-12 object-cover"
            />
          </div>

          <div className="min-w-0">
            <div className="font-extrabold text-slate-900 leading-tight group-hover:text-blue-700 transition">
              {name}
            </div>
            <div className="text-xs text-slate-500">
              Starting at Rs. {basePriceFrom ?? 0}
            </div>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}
