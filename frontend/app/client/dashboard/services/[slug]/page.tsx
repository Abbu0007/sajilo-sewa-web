import { getFavourites, getProvidersByService, getServices } from "@/lib/actions/client-actions";
import ServiceProvidersClient from "./service-providers-client";

export default async function ServiceProvidersPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const servicesRes = await getServices();
  const services = servicesRes.items || [];
  const current = services.find((s) => s.slug === slug) || null;

  const providersRes = await getProvidersByService(slug);
  const providers = providersRes.items || [];
  let favourites: any[] = [];
  try {
    const favRes = await getFavourites();
    favourites = favRes.items || [];
  } catch {
    favourites = [];
  }

  return (
    <ServiceProvidersClient
      slug={slug}
      service={current}
      providers={providers}
      initialFavourites={favourites}
    />
  );
}