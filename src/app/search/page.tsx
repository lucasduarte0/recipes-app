import SearchPageClient from "./SearchPageClient";
import { getCuisisnes } from "@/lib/recipes";

export default async function SearchPage() {
  const cuisines = await getCuisisnes();

  return <SearchPageClient cuisines={cuisines} />;
}
