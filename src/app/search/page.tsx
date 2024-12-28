import SearchPageClient from "./SearchPageClient";
import { getAllRecipeTags } from "@/lib/fetchRecipes";

export default async function SearchPage() {
  const categoryList = await getAllRecipeTags();

  return <SearchPageClient categoryList={categoryList} />;
}
