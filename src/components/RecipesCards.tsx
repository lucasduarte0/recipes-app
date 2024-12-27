"use client";

import { Card, CardContent } from "@/components/ui/card";
import { getRecipesWithPagination, searchRecipes } from "@/lib/fetchRecipes";
import Image from "next/image";
import Link from "next/link";
import { Star, Timer, ChefHat, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Recipe, RecipeWithPagination } from "@/lib/types";

const ITEMS_PER_PAGE = 8;

interface RecipesCardsProps {
  searchTerm: string;
}

export default function RecipesCards({ searchTerm }: RecipesCardsProps) {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, isFetching } =
    useInfiniteQuery<RecipeWithPagination, Error>({
      queryKey: ["recipes", searchTerm],
      queryFn: async ({ pageParam }) => {
        const skip = typeof pageParam === 'number' ? pageParam : 0;
        
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
      <div className={`w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 transition-opacity duration-200 ${isFetching ? 'opacity-70' : 'opacity-100'}`}>
        {data.pages.map((page) =>
          page.recipes.map((recipe: Recipe, index: number) => (
            <div key={recipe.id} className="space-y-1.5 w-full">
              <Link href={`/recipe/${recipe.id}`} passHref>
                <Card className="w-full p-0 overflow-hidden rounded-2xl border shadow-sm hover:shadow-lg transition-shadow duration-200">
                  {/* Recipe Header */}
                  <div className="absolute flex items-center gap-2 px-3 py-2 bg-opacity-90 rounded-md z-10">
                    <Badge
                      className="bg-white gap-2 py-1.5 border-none opacity-95 rounded-lg"
                      variant="outline"
                    >
                      <Star className="w-4 h-4 text-yellow-500" />
                      {recipe.rating || "4.8"}
                    </Badge>
                    <Badge
                      className="bg-white gap-2 py-1.5 border-none opacity-95 rounded-lg"
                      variant="outline"
                    >
                      <ChefHat className="w-4 h-4 text-gray-500" />
                      {recipe.difficulty || "Easy"}
                    </Badge>
                    <Badge
                      className="bg-white gap-2 py-1.5 border-none opacity-95 rounded-lg"
                      variant="outline"
                    >
                      <Timer className="w-4 h-4 text-red-500" />
                      <span className="">{`${recipe.prepTimeMinutes || 0} min`}</span>
                    </Badge>
                  </div>

                  {/* Recipe Image */}
                  <CardContent className="p-0">
                    <Image
                      className="object-cover w-full h-64 sm:h-56"
                      src={recipe.image}
                      width={350}
                      height={350}
                      alt={recipe.name || "Recipe Image"}
                      priority={index === 0}
                    />
                  </CardContent>
                </Card>
              </Link>
              <h2 className="text-xl font-playful font-semibold">{recipe.name}</h2>
            </div>
          ))
        )}
      </div>
      
      <div ref={ref} className="w-full flex justify-center p-4">
        {isFetchingNextPage || isFetching ? (
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        ) : hasNextPage ? (
          <div className="text-gray-500">Load more recipes when scrolling...</div>
        ) : (
          <div className="text-gray-500">No more recipes to load</div>
        )}
      </div>
    </>
  );
}
