import { RecipeCard } from '@/components/recipe-card/RecipeCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getUserWithRecipesAndCounts } from '@/services/users';
import { auth } from '@clerk/nextjs/server';
import { User } from 'lucide-react';
import { redirect } from 'next/navigation';
import { followUser, unfollowUser, isFollowing } from '@/services/followers';
import { revalidatePath } from 'next/cache';

type FollowResponse = {
  success: boolean;
  data?: boolean;
  error?: string;
};

async function toggleFollow(followerId: string, followingId: string, currentlyFollowing: boolean) {
  'use server';

  if (currentlyFollowing) {
    await unfollowUser({ followerId, followingId });
  } else {
    await followUser({ followerId, followingId });
  }

  revalidatePath(`/profile/${followingId}`);
}

export default async function UserProfilePage({
  params,
}: {
  params: { userId: string };
}) {
  const { userId: currentUserId } = await auth();

  if (!currentUserId) {
    redirect('/sign-in');
  }

  // If trying to view own profile, redirect to /profile
  if (params.userId === currentUserId) {
    redirect('/profile');
  }

  const [user, followStatus] = await Promise.all([
    getUserWithRecipesAndCounts(params.userId),
    isFollowing({ followerId: currentUserId, followingId: params.userId }) as Promise<FollowResponse>,
  ]);

  if (!user) {
    return <div>User not found</div>;
  }

  // Default to false if the status check failed or data is undefined
  const isUserFollowing = followStatus.success && followStatus.data ? followStatus.data : false;

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
        </div>

        <h1 className="text-2xl font-bold mt-4">{`${user.firstName} ${user.lastName}`}</h1>
        <p className="text-gray-500">@{user.username}</p>

        <form action={toggleFollow.bind(null, currentUserId, user.id, isUserFollowing)} className="mt-4">
          <Button 
            type="submit"
            variant={isUserFollowing ? "outline" : "default"}
            className="w-32"
          >
            {isUserFollowing ? 'Unfollow' : 'Follow'}
          </Button>
        </form>

        {/* Bio */}
        {user.bio && (
          <p className="mt-4 text-gray-500">{user.bio}</p>
        )}

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
        <h2 className="text-lg font-semibold mb-4">Recipes</h2>
        {user.recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-4xl mb-4">📸</div>
            <p className="text-muted-foreground text-center">No recipes yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {user.recipes.map((recipe) => (
              <div key={recipe.id} className="relative">
                <RecipeCard recipe={recipe} imageAspectRatio="square">
                  <h2 className="text-base font-playful font-semibold">{recipe.name}</h2>
                </RecipeCard>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}