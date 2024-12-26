import { Card, CardContent } from "./ui/card";
import { getRecipesWithPagination } from "@/lib/fetchRecipes";
import Image from "next/image";
import Link from "next/link";
import { Star, Timer, ChefHat } from "lucide-react";
import { Badge } from "./ui/badge";

export default async function RecipesCards() {
  const recipes = await getRecipesWithPagination([
    "name",
    "image",
    "rating",
    "difficulty",
    "prepTimeMinutes",
  ]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 w-full ">
      {recipes.recipes.map((recipe, index) => (
        <div key={index} className="space-y-1.5 w-full">
          <Link href={`/recipe/${recipe.id}`} passHref>
            <Card
              key={index}
              className="w-full p-0 overflow-hidden rounded-lg border shadow-sm hover:shadow-lg transition-shadow duration-200"
            >
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
                  <span className="">{`${recipe.prepTimeMinutes} min`}</span>
                </Badge>
              </div>

              {/* Recipe Image */}
              <CardContent className="p-0">
                <Image
                  className="object-cover w-full h-56"
                  src={recipe.image}
                  width={350}
                  height={350}
                  alt={recipe.name || "Recipe Image"}
                />
              </CardContent>
            </Card>
          </Link>
          <h2 className="text-lg font-semibold">{recipe.name}</h2>
        </div>
      ))}
    </div>
  );
}