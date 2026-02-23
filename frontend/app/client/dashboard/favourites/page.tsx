import { getFavourites, getServices } from "@/lib/actions/client-actions";
import FavouritesClient from "./favourites-client";

export default async function FavouritesPage() {
  const favRes = await getFavourites();
  const servicesRes = await getServices();

  return (
    <FavouritesClient
      initialItems={favRes.items || []}
      services={servicesRes.items || []}
    />
  );
}