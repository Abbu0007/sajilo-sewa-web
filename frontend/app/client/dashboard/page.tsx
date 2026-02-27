import { getFavourites, getServices, getTopRatedProviders } from "@/lib/actions/client-actions";
import ServiceCard from "../_components/ServiceCard";
import ProvidersSection from "./providers-section";
import GlassCard from "../_components/ui/GlassCard";
import SectionHeader from "../_components/ui/SectionHeader";

export default async function ClientDashboardPage() {
  const servicesRes = await getServices();
  const services = servicesRes.items || [];

  let topProviders: any[] = [];
  try {
    const topRes = await getTopRatedProviders(8);
    topProviders = topRes.items || [];
  } catch {
    topProviders = [];
  }

  let favourites: any[] = [];
  try {
    const favRes = await getFavourites();
    favourites = favRes.items || [];
  } catch {
    favourites = [];
  }

  return (
    <div className="space-y-6">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl border border-white/35 bg-gradient-to-br from-blue-700 via-blue-800 to-slate-950 text-white">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-28 -bottom-28 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative p-6 sm:p-10">
          <div className="text-3xl sm:text-4xl font-extrabold leading-tight">
            Find Trusted Home Services <br className="hidden sm:block" /> in Minutes
          </div>
          <div className="mt-3 text-sm sm:text-base text-white/80 max-w-2xl">
            Book reliable professionals for cleaning, repairs, maintenance and more. Quality service at your doorstep.
          </div>

          <div className="mt-7 grid grid-cols-1 md:grid-cols-[3fr_1fr_auto] gap-10">
            <input
              className="h-12 rounded-2xl px-4 text-slate-900 bg-white/90 placeholder:text-slate-400 border border-white/30 outline-none focus:ring-2 focus:ring-white/40"
              placeholder="What service do you need?"
            />
            <button className="h-12 rounded-2xl bg-white/15 hover:bg-white/20 border border-white/25 px-6 font-extrabold transition active:scale-[0.98]">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Popular Services */}
      <GlassCard className="p-5 sm:p-6">
        <SectionHeader title="Popular Services" description="Tap a service to see available professionals." />

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {services.slice(0, 6).map((s) => (
            <ServiceCard key={s._id} name={s.name} slug={s.slug} basePriceFrom={s.basePriceFrom} />
          ))}
        </div>
      </GlassCard>

      {/* Top Rated */}
      <ProvidersSection initialProviders={topProviders} services={services} initialFavourites={favourites} />
    </div>
  );
}