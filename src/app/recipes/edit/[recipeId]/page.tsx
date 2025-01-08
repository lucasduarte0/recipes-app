import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getCuisines, getRecipeById } from '@/services/recipes';
import { EditRecipeForm } from './EditRecipeForm';

interface EditRecipePageProps {
  params: Promise<{ recipeId: string }>;
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  const { recipeId } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const recipe = await getRecipeById(parseInt(recipeId));
  const cuisines = await getCuisines();

  if (!recipe || recipe.userId !== userId) {
    redirect('/recipes');
  }

  return (
    <div className="container max-w-4xl pt-8 pb-20">
      <h1 className="text-3xl font-bold mb-8">Edit Recipe</h1>
      <EditRecipeForm recipe={recipe} userId={userId} cuisines={cuisines} />
    </div>
  );
}
