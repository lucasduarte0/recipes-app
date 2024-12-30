'use client';

import { RecipeCard } from '@/components/recipe-card/RecipeCard';
import { Loader2 } from 'lucide-react';
import LoadMoreIndicator from '@/components/recipe-card/LoadMoreIndicator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Heart } from 'lucide-react';
import { useRecipes } from '@/hooks/useRecipes';

interface RecipesCardsProps {
  searchTerm: string;
}

export default function RecipesCards({ searchTerm }: RecipesCardsProps) {
  const {
    isLoading,
    isError,
    data,
    error,
    isFetchingNextPage,
    isFetching,
    hasNextPage,
    ref,
  } = useRecipes({
    searchTerm,
    itemsPerPage: 8,
  });

  if (isLoading) {
    return (
      <div className="w-full flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  if (isError && error) {
    return (
      <div className="w-full">
        {error.name} - {error.message}
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
        {data?.pages.map((page) =>
          page.recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} badges={true}>
              <div className="flex justify-between items-center w-full">
                <div className="w-full">
                  <div className="flex justify-between items-start">
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
                      <span className="text-sm font-semibold text-muted-foreground">
                        {Math.floor(Math.random() * 51)}
                      </span>
                      <Heart
                        className="text-muted-foreground"
                        size={16}
                        strokeWidth={2.5}
                      />
                    </div>
                  </div>
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
