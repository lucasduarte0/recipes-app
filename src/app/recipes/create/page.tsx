import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getCuisines } from '@/services/recipes';
import { CreateRecipeForm } from './CreateRecipeForm';

export default async function CreateRecipePage() {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const cuisines = await getCuisines();

  return (
    <div className="container max-w-3xl py-10 pb-20">
      <h1 className="text-3xl font-bold mb-8">Create New Recipe</h1>
      <CreateRecipeForm userId={user.id} cuisines={cuisines} />
    </div>
  );
}
