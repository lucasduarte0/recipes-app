import { Suspense } from 'react';
import { buildRecipeWhereClause } from '@/services/recipesFilter';
import { Loader2 } from 'lucide-react';
import { searchRecipes } from '@/services/recipes';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import { InfiniteRecipes } from '@/app/recipes/InfiniteRecipes';
import { loadSearchParams } from '@/components/SearchParams';
import { SearchBar } from '@/components/SearchBar';
import { FilterSelector } from '@/components/FilterSelector';

interface RecipePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function RecipesPage({ searchParams }: RecipePageProps) {
  // Load searchParams with search and filter
  const { search, ...filters } = await loadSearchParams.parse(searchParams);

  // Build the where clause for the recipes filter
  const where = await buildRecipeWhereClause(filters);

  console.log(where)

  // set 'searchTerm' undefined if null
  const searchTerm = search ?? undefined;

  // Search recipes with the where clause and search term
  const initialData = await searchRecipes({
    searchTerm: search ?? undefined,
    where,
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  return (
    <div className="min-h-screen pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] grid place-items-start gap-5 py-8 sm:py-12">
        <Suspense
          fallback={
            <div className="w-full flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>
          }>
          <SearchBar />
          <FilterSelector />
          <InfiniteRecipes initialData={initialData} searchTerm={searchTerm} where={where} />
        </Suspense>
      </main>
    </div>
  );
}
