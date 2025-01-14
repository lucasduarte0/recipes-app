'use client';

import { useRecipes } from '@/hooks/useRecipes';
import { RecipeWhereInput, RecipeWithUserAndLikeFlag } from '@/lib/types';
import { RecipeCard } from '@/components/recipe-card/RecipeCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { LikeButton } from '@/components/LikeButton';
import { Loader2, User as UserIcon } from 'lucide-react';
import LoadMoreIndicator from '@/components/recipe-card/LoadMoreIndicator';
import { LikeButton } from '@/components/LikeButton';
import Link from 'next/link';
interface InfiniteRecipesProps {
  initialData: {
    recipes: RecipeWithUserAndLikeFlag[];
    total: number;
    pageSize: number;
    hasMore: boolean;
  };
  searchTerm?: string;
  where?: RecipeWhereInput;
  userId?: string;
}

export function InfiniteRecipes({ initialData, searchTerm = '', where = {}, userId }: InfiniteRecipesProps) {
  const { data, isLoading, isError, error, isFetchingNextPage, isFetching, hasNextPage, ref } = useRecipes({
    searchTerm,
    where,
    itemsPerPage: initialData.pageSize,
    initialData,
    userId,
  });

  if (isLoading) {
    console.log('Loading...');
    return (
      <div className="w-full flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  if (isError && error instanceof Error) {
    console.error('Error:', error);
    return <div className="w-full text-center text-red-500">Error: {error.message}</div>;
  }

  if (!data?.pages) {
    console.log('No data found');
    return null;
  }

  return (
    <>
      <div
        className={`w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 transition-opacity duration-200`}>
        {data.pages.map((page) =>
          page.recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} badges={true}>
              <div className="flex justify-between items-start w-full">
                <div className="flex flex-col gap-1">
                  <h2 className="text-base font-playful font-semibold">{recipe.name}</h2>
                  <Link href={`/profile/${recipe.user.id}`}>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        {recipe.user.imageUrl && <AvatarImage src={recipe.user.imageUrl} />}
                        <AvatarFallback>
                          <UserIcon />
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{recipe.user.username}</span>
                    </div>
                  </Link>
                </div>

                <div className="flex items-center gap-2 py-1">
                  <LikeButton
                    recipeId={recipe.id}
                    isLiked={recipe.hasUserLiked}
                    likeCount={recipe._count.recipeLikes}
                  />
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
