import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getRecipeById } from "@/lib/fetchRecipes";
import { Clock, Star, ChefHat, ChevronLeft } from "lucide-react";
import NumericSelector from "@/components/NumericSelector";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

type Props = {
  params: { recipeId: string };
};

export default async function Page({ params }: Props) {
  const { recipeId } = params;
  const recipe = await getRecipeById(parseInt(recipeId));

  const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);

  return (
    <div className="relative max-w-4xl mx-auto min-h-screen">
      <div className="relative w-full h-[45vh] sm:h-[450px]">
        <Link
          href="/"
          className="fixed z-10 top-4 left-4 p-2 bg-white/70 hover:bg-white/90 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div className="fixed sm:absolute top-0 left-0 right-0 w-full h-[50vh] sm:h-[450px]">
          <Image
            className="w-full h-full object-cover"
            src={recipe.image}
            alt={recipe.name}
            fill
            priority
            quality={90}
          />
        </div>
      </div>

      <div className="relative z-10">
        <div className="bg-white rounded-t-[32px] p-6 sm:p-8 shadow-lg">
          {/* Badges */}
          <div className="w-full flex items-center justify-center mb-6">
            <div className="w-full flex justify-evenly items-center gap-6">
              <div className="flex flex-col items-center gap-1">
                <ChefHat className="w-6 h-6 text-primary" strokeWidth={1.5} />
                <span className="text-sm font-[400]">{recipe.difficulty || 'Easy'}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Clock className="w-6 h-6 text-primary" strokeWidth={1.5} />
                <span className="text-sm font-[400]">
                  {totalTime} min
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Star className="w-6 h-6 text-primary" strokeWidth={1.5} />
                <span className="text-sm font-[400]">{recipe.rating || '4.5'}</span>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-playful font-bold mb-4">
            {recipe.name}
          </h1>
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {recipe.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="space-y-5">
            {/* Ingredients Qty */}
            <div className="flex items-center justify-around gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Ingredients</h2>
                <span className="text-base text-muted-foreground">
                  How many servings?
                </span>
              </div>
              <div className="flex gap-2 flex-grow justify-end">
                <NumericSelector
                  min={0}
                  max={10}
                  defaultValue={recipe.servings || 4}
                />
              </div>
            </div>

            {/* Ingredients List */}
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <ul className="space-y-5">
                {recipe.ingredients.map((ingredient: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <Checkbox id={`ingredient-${index}`} />
                    <label
                      htmlFor={`ingredient-${index}`}
                      className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {ingredient}
                    </label>
                  </li>
                ))}
              </ul>
            )}

            <Separator />

            {/* Instructions */}
            {recipe.instructions && recipe.instructions.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
                <ol className="space-y-4">
                  {recipe.instructions.map(
                    (instruction: string, index: number) => (
                      <li key={index} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-medium">
                          {index + 1}
                        </span>
                        <p className="">{instruction}</p>
                      </li>
                    )
                  )}
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
