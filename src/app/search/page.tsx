import SearchPageClient from "./SearchPageClient";
import { getCuisines } from "@/lib/recipes";

export default async function SearchPage() {
  const cuisines = await getCuisines();

  return <SearchPageClient cuisines={cuisines} />;
}
