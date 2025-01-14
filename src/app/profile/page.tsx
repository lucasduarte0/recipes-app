export const dynamic = 'force-dynamic';

import { RecipeCard } from '@/components/recipe-card/RecipeCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getUserWithRecipesAndCounts, updateUser, isUsernameAvailable } from '@/services/users';
import { auth } from '@clerk/nextjs/server';
import { Pencil } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { EditBioDialog } from './_components/EditBioDialog';
import { EditProfileDialog } from './_components/EditProfileDialog';
import { EditAvatarDialog } from './_components/EditAvatarDialog';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/services/auth';

async function updateProfileImage(formData: FormData) {
  'use server';

  const { userId } = await auth();
  if (!userId) {
    throw new Error('Not authenticated');
  }

  const file = formData.get('image') as File;
  if (!file) {
    throw new Error('No file provided');
  }

  // Vercel URL
  let vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
  if (!vercelUrl) {
    vercelUrl = process.env.VERCEL_URL;
  } // Fallback URL if NEXT_PUBLIC_VERCEL_URL is not set

  // Add protocol if not present
  if (vercelUrl && !vercelUrl.startsWith('http://') && !vercelUrl.startsWith('https://')) {
    vercelUrl = `https://${vercelUrl}`;
  }

  try {
    // Create a new FormData instance and append the file
    const imageFormData = new FormData();
    imageFormData.append('file', file);

    // Make a request to our bucket API route
    const response = await fetch(`${vercelUrl}/api/bucket`, {
      method: 'POST',
      body: imageFormData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload image');
    }

    const { url: imageUrl } = await response.json();

    // Update user profile with the new image URL
    await updateUser(userId, { imageUrl });
    revalidatePath('/profile');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update profile image: ${error.message}`);
    }
    throw new Error('Failed to update profile image');
  }
}

async function updateProfile(formData: FormData) {
  'use server';

  const { userId } = await auth();
  if (!userId) {
    throw new Error('Not authenticated');
  }

  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const username = formData.get('username') as string;
  const bio = formData.get('bio') as string | null;

  // Basic validation
  if (!firstName || !lastName || !username) {
    throw new Error('Required fields are missing');
  }

  try {
    // Check if username already exists (excluding current user)
    const existingUser = await isUsernameAvailable(username);

    if (existingUser) {
      if (existingUser.id === username) {
        throw new Error('Username already taken');
      }
    }

    await updateUser(userId, {
      firstName,
      lastName,
      username,
      bio,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
    throw new Error('Failed to update profile');
  }

  revalidatePath('/profile');
}

export default async function ProfilePage() {
  const clerkUser = await getCurrentUser();

  if (!clerkUser) {
    redirect('/');
  }

  const user = await getUserWithRecipesAndCounts(clerkUser.id);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <main className="container max-w-lg mx-auto px-4 pb-20">
      {/* Profile Header */}
      <div className="flex flex-col items-center mt-8">
        <EditAvatarDialog user={user} updateProfileImage={updateProfileImage} />

        <h1 className="text-2xl font-bold mt-4">{`${user.firstName} ${user.lastName}`}</h1>
        <p className="text-gray-500">@{user.username}</p>

        <EditProfileDialog user={user} updateProfile={updateProfile} />

        {/* Bio */}
        {user.bio ? (
          <div className="">
            <p className="mt-4 text-gray-500">{user.bio}</p>
          </div>
        ) : (
          <div className="pt-2">
            <EditBioDialog user={user} />
          </div>
        )}

        {/* Stats */}
        <div className="flex justify-center gap-8 mt-4 w-full">
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
