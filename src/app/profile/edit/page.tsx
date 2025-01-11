import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { EditProfileForm } from './EditProfileForm';
import { isUsernameAvailable, updateUser } from '@/services/users';

async function updateProfile(formData: FormData) {
  'use server';

  const { userId } = await auth();
  if (!userId) {
    throw new Error('Not authenticated');
  }

  const firstName = formData.get('firstName') as string;
  const username = formData.get('username') as string;
  // const email = formData.get('email') as string;
  const bio = formData.get('bio') as string;
  const gender = formData.get('gender') as string;
  const birthday = formData.get('birthday') as string;

  // Basic validation
  if (!firstName || !username) {
    throw new Error('Required fields are missing');
  }

  try {
    // Check if username or email already exists (excluding current user)
    const existingUser = await isUsernameAvailable(username);

    if (existingUser) {
      if (existingUser.id === username) {
        throw new Error('Username already taken');
      }
    }

    await updateUser(userId, {
      firstName,
      username,
      bio: bio || null,
      gender: gender || null,
      birthday: birthday ? new Date(birthday) : null,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
    throw new Error('Failed to update profile');
  }

  revalidatePath('/profile');
  redirect('/profile');
}

export default async function EditProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <main className="container max-w-lg mx-auto px-4">
      <div className="space-y-6">
        <div className="pt-4 pb-2">
          <h1 className="text-2xl font-bold">Edit Profile</h1>
        </div>

        <EditProfileForm user={user} updateProfile={updateProfile} />
      </div>
    </main>
  );
}
