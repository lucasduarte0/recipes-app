'use client';

import { useCallback } from 'react';
import { useQueryState, parseAsString } from 'nuqs';
import Search from '@/components/Search';
import RecipesCards from '@/components/recipe-card/RecipesCards';
import type { RecipeFilters } from '@/services/recipesFilter';
import { RecipeWithUser } from '@/lib/types';

interface RecipesGridProps {
  searchParams: { [key: string]: string | string[] | undefined };
  initialData: {
    recipes: RecipeWithUser[];
    pagination: {
      total: number;
      pageSize: number;
      currentPage: number;
      totalPages: number;
      hasMore: boolean;
    };
  };
  filters: RecipeFilters; // Changed from Promise<RecipeFilters> since this is a client component
}

export function RecipesGrid({
  searchParams,
  initialData,
  filters,
}: RecipesGridProps) {
  // Search term with initial value from searchParams
  const [searchTerm, setSearchTerm] = useQueryState(
    'search',
    parseAsString.withDefault(
      typeof searchParams.search === 'string' ? searchParams.search : ''
    )
  );

  const handleSearch = useCallback(
    (value: string) => {
      setSearchTerm(value || null);
    },
    [setSearchTerm]
  );

  return (
    <div className="w-full space-y-4">
      <Search value={searchTerm} onChange={handleSearch} />
      <RecipesCards
        searchTerm={searchTerm}
        filters={filters}
        initialData={initialData}
      />
    </div>
  );
}
