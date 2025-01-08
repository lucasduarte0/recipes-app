import { Suspense } from 'react';
import {
  buildRecipeWhereClause,
  parseRecipeSearchFilters,
} from '@/services/recipesFilter';
import { Loader2 } from 'lucide-react';
import { searchRecipes } from '@/services/recipes';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import { InfiniteRecipes } from '@/app/recipes/InfiniteRecipes';

interface RecipePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function RecipesPage({ searchParams }: RecipePageProps) {
  const resolvedParams = await searchParams;
  const searchTerm =
    typeof resolvedParams.search === 'string' ? resolvedParams.search : '';
  const filters = await parseRecipeSearchFilters(resolvedParams);
  const recipeFilters = await buildRecipeWhereClause(filters);

  const { recipes, total, pageSize, hasMore } = await searchRecipes({
    searchTerm,
    where: recipeFilters,
    page: Number(resolvedParams.page) || 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const initialData = {
    recipes,
    total,
    pageSize,
    hasMore: hasMore ?? false,
  };

  return (
    <div className="min-h-screen pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] grid place-items-start gap-5 py-8 sm:py-12">
        <Suspense
          fallback={
            <div className="w-full flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>
          }>
          <InfiniteRecipes
            initialData={initialData}
            searchTerm={searchTerm}
            where={recipeFilters}
          />
        </Suspense>
      </main>
    </div>
  );
}
