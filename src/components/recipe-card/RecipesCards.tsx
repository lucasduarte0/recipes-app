'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { RecipeCard } from '@/components/recipe-card/RecipeCard';
import LoadMoreIndicator from '@/components/recipe-card/LoadMoreIndicator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { LikeButton } from '../LikeButton';
import type { RecipeFilters } from '@/services/recipes';
import { fetchMoreRecipes } from '@/services/recipes';
import { RecipeWithUser } from '@/lib/types';

interface RecipesCardsProps {
  searchTerm?: string;
  filters: RecipeFilters;
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
}

export default function RecipesCards({
  searchTerm = '',
  filters,
  initialData,
}: RecipesCardsProps) {
  const { ref, inView } = useInView();

  const {
    isLoading,
    isError,
    data,
    error,
    isFetchingNextPage,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['recipes', searchTerm, filters],
    queryFn: async ({ pageParam }) => {
      return fetchMoreRecipes(searchTerm, filters, pageParam);
    },
    initialPageParam: 0,
    initialData: {
      pages: [initialData],
      pageParams: [0],
    },
    getNextPageParam: (lastPage) => 
      lastPage.pagination.hasMore ? lastPage.pagination.currentPage + 1 : undefined,
    staleTime: 1000 * 60, // 1 minute
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  if (isError && error instanceof Error) {
    return (
      <div className="w-full text-center text-red-500">
        Error: {error.message}
      </div>
    );
  }

  if (!data?.pages) {
    return null;
  }

  return (
    <>
      <div
        className={`w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 transition-opacity duration-200 ${
          isFetchingNextPage ? 'opacity-70' : 'opacity-100'
        }`}>
        {data.pages.map((page) =>
          page.recipes.map((recipe: RecipeWithUser) => (
            <RecipeCard key={recipe.id} recipe={recipe} badges={true}>
              <div className="flex justify-between items-start w-full">
                <div className="flex flex-col gap-1">
                  <h2 className="text-base font-playful font-semibold">
                    {recipe.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={recipe.user.imageUrl} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      {recipe.user.username}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 py-1">
                  <LikeButton recipeId={recipe.id} userId={recipe.user.id} />
                </div>
              </div>
            </RecipeCard>
          ))
        )}
      </div>

      <LoadMoreIndicator
        ref={ref}
        isFetching={isFetching}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
      />
    </>
  );
}
