import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { searchRecipes } from '@/lib/recipes';
import { Prisma } from '@prisma/client';

interface UseRecipesOptions {
  searchTerm?: string;
  where?: Prisma.RecipeWhereInput;
  itemsPerPage?: number;
  staleTime?: number;
}

export function useRecipes({
  searchTerm = '',
  where = {},
  itemsPerPage = 8,
  staleTime = 1000 * 60, // 1 minute default
}: UseRecipesOptions = {}) {
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
    queryKey: ['recipes', searchTerm],
    queryFn: async ({ pageParam }) => {
      const skip = typeof pageParam === 'number' ? pageParam : 0;
      const { recipes, total, take } = await searchRecipes(
        { searchTerm, where },
        skip,
        itemsPerPage
      );
      return {
        recipes,
        skip,
        take,
        total,
      };
    },
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.take;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
    initialPageParam: 0,
    staleTime,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  return {
    isLoading,
    isError,
    data,
    error,
    isFetchingNextPage,
    isFetching,
    fetchNextPage,
    hasNextPage,
    ref, // Intersection observer ref
  };
}
