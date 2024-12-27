import { Recipe } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { RecipeBadges } from "@/components/recipe-card/RecipeBadges";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className="space-y-1.5 w-full">
      <Link href={`/recipes/${recipe.id}`} passHref>
        <Card className="w-full p-0 overflow-hidden rounded-2xl border shadow-sm hover:shadow-lg transition-shadow duration-200">
          <RecipeBadges
            rating={recipe.rating ?? 5}
            difficulty={recipe.difficulty ?? "Easy"}
            prepTimeMinutes={recipe.prepTimeMinutes ?? 30}
          />
          <CardContent className="p-0">
            <Image
              className="object-cover w-full h-64 sm:h-56"
              src={recipe.image}
              width={350}
              height={350}
              alt={recipe.name || "Recipe Image"}
              // priority={priority}
            />
          </CardContent>
        </Card>
      </Link>
      <h2 className="text-xl font-playful font-semibold">{recipe.name}</h2>
    </div>
  );
}
