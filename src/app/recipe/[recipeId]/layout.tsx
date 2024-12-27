import { getRecipeById } from "@/lib/fetchRecipes";
import { Metadata } from "next";

type Props = {
  params: { recipeId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { recipeId } = await params;
    const recipe = await getRecipeById(parseInt(recipeId));

    return {
      title: recipe.name,
      description: `Recipe for ${recipe.name} - ${
        recipe.difficulty
      } difficulty, ${recipe.prepTimeMinutes + recipe.cookTimeMinutes} minutes`,
      openGraph: {
        images: [recipe.image],
      },
    };
  } catch {
    return {
      title: "Recipe Not Found",
      description: "The requested recipe could not be found.",
    };
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
