import { getRecipeById } from '@/services/recipes';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ recipeId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { recipeId } = await params; // No need to await params
    const recipe = await getRecipeById(parseInt(recipeId)).then((recipe) => {
      if (!recipe) {
        throw new Error('Recipe not found');
      }
      return recipe;
    });

    return {
      title: recipe.name,
      description: `Recipe for ${recipe.name} - ${
        recipe.difficulty
      } difficulty, ${
        recipe.prepTimeMinutes && recipe.cookTimeMinutes
          ? recipe.prepTimeMinutes + recipe.cookTimeMinutes
          : ''
      } minutes`,
      openGraph: {
        title: recipe.name,
        description: `Recipe for ${recipe.name} - ${
          recipe.difficulty
        } difficulty, ${
          recipe.prepTimeMinutes && recipe.cookTimeMinutes
            ? recipe.prepTimeMinutes + recipe.cookTimeMinutes
            : ''
        } minutes`,
        type: 'article',
        images: recipe.image ? [
          {
            url: recipe.image,
            width: 1200,
            height: 630,
            alt: `${recipe.name} recipe image`
          }
        ] : [],
      },
    };
  } catch {
    return {
      title: 'Recipe Not Found',
      description: 'The requested recipe could not be found.',
      openGraph: {
        title: 'Recipe Not Found',
        description: 'The requested recipe could not be found.',
        type: 'article',
      },
    };
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
