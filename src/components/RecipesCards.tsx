"use client";

import { Card, CardContent } from "@/components/ui/card";
import { getRecipesWithPagination } from "@/lib/fetchRecipes";
import Image from "next/image";
import Link from "next/link";
import { Star, Timer, ChefHat } from "lucide-react";
import { Badge } from "./ui/badge";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const ITEMS_PER_PAGE = 8;

export default function RecipesCards() {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["recipes"],
      queryFn: async ({ pageParam = 0 }) => {
        return getRecipesWithPagination(
          ["name", "image", "rating", "difficulty", "prepTimeMinutes"],
          ITEMS_PER_PAGE,
          pageParam
        );
      },
      getNextPageParam: (lastPage) => {
        const nextSkip = lastPage.skip + lastPage.limit;
        return nextSkip < lastPage.total ? nextSkip : undefined;
      },
      initialPageParam: 0,
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error loading recipes</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 w-full">
      {data.pages.map((page) =>
        page.recipes.map((recipe, index) => (
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
                    <span className="">{`${
                      recipe.prepTimeMinutes || 0
                    } min`}</span>
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
            <h2 className="text-xl font-playful font-semibold">
              {recipe.name}
            </h2>
          </div>
        ))
      )}
      <div ref={ref} className="col-span-full flex justify-center p-4">
        {isFetchingNextPage ? (
          <div>Loading more...</div>
        ) : hasNextPage ? (
          <div>Loading more recipes when scrolling...</div>
        ) : (
          <div>No more recipes to load</div>
        )}
      </div>
    </div>
  );
}
