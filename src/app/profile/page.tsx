import { RecipeCard } from '@/components/recipe-card/RecipeCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getUserWithRecipesAndCounts } from '@/services/users';
import { auth } from '@clerk/nextjs/server';
import { Edit2, Pencil, Plus, User } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  const user = await getUserWithRecipesAndCounts(userId);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <main className="container max-w-lg mx-auto px-4 pb-20">
      {/* Profile Header */}
      <div className="flex flex-col items-center mt-8">
        <div className="relative">
          <Avatar className="w-24 h-24">
            <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-2xl">
              {user.imageUrl && <AvatarImage src={user.imageUrl} />}
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </div>
          </Avatar>
          {!user.imageUrl && (
            <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md">
              <Plus size={16} />
            </button>
          )}
        </div>

        <h1 className="text-2xl font-bold mt-4">{`${user.firstName} ${user.lastName}`}</h1>
        <p className="text-gray-500">@{user.username}</p>

        <Button variant="outline" className="mt-4 rounded-full px-8" asChild>
          <Link href="/profile/edit">Edit Profile</Link>
        </Button>

        <p className="text-sm mt-4">
          {user.bio || (
            <span className="text-primary flex items-center">
              <Edit2 size={16} className="mr-1.5 inline-block" />
              Add a bio to share your cooking journey
            </span>
          )}
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-8 mt-6 w-full">
          <div className="text-center">
            <p className="font-bold">{user.recipes.length}</p>
            <p className="text-gray-500 text-sm">Recipes</p>
          </div>
          <div className="text-center">
            <p className="font-bold">{user._count.following}</p>
            <p className="text-gray-500 text-sm">Following</p>
          </div>
          <div className="text-center">
            <p className="font-bold">{user._count.followers}</p>
            <p className="text-gray-500 text-sm">Followers</p>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Recipes Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">My Recipes</h2>
        {user.recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-4xl mb-4">📸</div>
            <p className="text-muted-foreground text-center">Your recipes will appear here after posting.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {user.recipes.map((recipe) => (
              <div key={recipe.id} className="relative">
                <RecipeCard recipe={recipe} imageAspectRatio="square">
                  <h2 className="text-base font-playful font-semibold">{recipe.name}</h2>
                </RecipeCard>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full shadow-md text-foreground bg-background hover:bg-primary/80"
                  asChild>
                  <Link href={`/recipes/edit/${recipe.id}`}>
                    <Pencil className="h-3 w-3 " />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
