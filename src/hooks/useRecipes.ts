import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Prisma } from '@prisma/client';
import { searchRecipes } from '@/services/recipes';
import { RecipeWithUser } from '@/lib/types';

interface UseRecipesOptions {
  searchTerm?: string;
  where?: Prisma.RecipeWhereInput;
  itemsPerPage?: number;
  staleTime?: number;
  initialData?: {
    recipes: RecipeWithUser[];
    total: number;
    pageSize: number;
    hasMore: boolean;
  };
}

export function useRecipes({
  searchTerm = '',
  where = {},
  itemsPerPage = 8,
  staleTime = 1000 * 60 * 5, // 5 minutes default
  initialData,
}: UseRecipesOptions = {}) {
  // Memoize the where clause to prevent unnecessary re-renders
  const whereKey = JSON.stringify(where);
  const { ref, inView } = useInView();

  // console.log(`Triggering use recipe with page ${inView ? 'next' : 'initial'}`);

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
    queryKey: ['recipes', searchTerm, whereKey],
    gcTime: 1000 * 60 * 30, // Garbage collection time: 30 minutes
    staleTime, // Use the staleTime parameter passed to the hook
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    refetchOnReconnect: false, // Prevent refetch on reconnect
    refetchOnMount: false, // Prevent refetch on component mount
    queryFn: async ({ pageParam = 0 }) => {
      // Default initial pageParam to 0
      const performanceStart = performance.now(); // Start time measurement
      console.log(`Fetching recipes with page ${pageParam}`);
      const recipes = await searchRecipes({
        searchTerm,
        where,
        page: pageParam,
        pageSize: itemsPerPage,
      });
      const performanceEnd = performance.now(); // End time measurement
      // Log the performance
      console.log(`Time taken to fetch recipes in query: ${performanceEnd - performanceStart}ms`);
      return recipes;
    },
    getNextPageParam: (lastPage, allPages) => {
      // If hasMore is true, return the next page number
      return lastPage.hasMore ? allPages.length : undefined;
    },
    initialPageParam: 0,
    initialData: initialData
      ? {
          pages: [
            {
              recipes: initialData.recipes,
              total: initialData.total,
              pageSize: initialData.pageSize,
              hasMore: initialData.hasMore ?? false,
            },
          ],
          pageParams: [0], // Start at page 0
        }
      : undefined,
  });

  useEffect(() => {
    // Trigger fetch only if in view, there's another page, and it's not already fetching
    if (inView && hasNextPage && !isFetchingNextPage) {
      console.log('Triggered new page');
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
