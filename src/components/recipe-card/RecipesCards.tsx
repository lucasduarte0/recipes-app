"use client";

import { getRecipesWithPagination, searchRecipes } from "@/lib/fetchRecipes";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Recipe, RecipeWithPagination } from "@/lib/types";
import { RecipeCard } from "@/components/recipe-card/RecipeCard";
import { Loader2 } from "lucide-react";
import LoadMoreIndicator from "@/components/recipe-card/LoadMoreIndicator";

const ITEMS_PER_PAGE = 8;

interface RecipesCardsProps {
  searchTerm: string;
}

export default function RecipesCards({ searchTerm }: RecipesCardsProps) {
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isFetching,
  } = useInfiniteQuery<RecipeWithPagination, Error>({
    queryKey: ["recipes", searchTerm],
    queryFn: async ({ pageParam }) => {
      const skip = typeof pageParam === "number" ? pageParam : 0;

      if (searchTerm.trim()) {
        const recipes = await searchRecipes(searchTerm);
        return {
          recipes,
          skip: 0,
          limit: recipes.length,
          total: recipes.length,
        };
      }
      return getRecipesWithPagination(
        ["name", "image", "rating", "difficulty", "prepTimeMinutes"],
        ITEMS_PER_PAGE,
        skip
      );
    },
    getNextPageParam: (lastPage) => {
      // Don't paginate search results
      if (searchTerm.trim()) return undefined;

      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60, // Keep data fresh for 1 minute
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (status === "pending") {
    return (
      <div className="w-full flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  if (status === "error") {
    return <div className="w-full">Error loading recipes</div>;
  }

  if (!data?.pages) {
    return null;
  }

  return (
    <>
      <div
        className={`w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 transition-opacity duration-200 ${
          isFetching ? "opacity-70" : "opacity-100"
        }`}
      >
        {data.pages.map((page) =>
          page.recipes.map((recipe: Recipe, index: number) => (
            <RecipeCard key={index} recipe={recipe} />
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
