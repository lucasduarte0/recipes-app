import { currentUser, auth, User as ClerkUser } from '@clerk/nextjs/server';
import { createUser, getUserById, UserWithFollow } from '@/services/users';
import { User } from '@prisma/client';

/**
 * Gets the current authenticated user from the database
 * Creates a new user if they don't exist
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    // Try to get user from database first
    const dbUser = await getUserById(userId);
    if (dbUser) return dbUser;

    // If not in database, get from Clerk and create
    return await syncUserWithClerk(userId);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

async function syncUserWithClerk(userId: string): Promise<User | null> {
  try {
    const clerkUser = await currentUser();
    if (!isValidClerkUser(clerkUser)) {
      throw new Error('Missing required user information');
    }

    await createUser({
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      email: clerkUser.primaryEmailAddress.emailAddress,
      imageUrl: clerkUser.imageUrl,
      username: clerkUser.username,
      createdAt: new Date().toISOString(),
    });

    return await getUserById(userId);
  } catch (error) {
    console.error('Error syncing user with Clerk:', error);
    return null;
  }
}

/**
 * Type guard to ensure Clerk user has all required fields
 */
function isValidClerkUser(user: ClerkUser | null): user is ClerkUser & {
  firstName: string;
  lastName: string;
  username: string;
  primaryEmailAddress: { emailAddress: string };
} {
  return !!(user && user.username && user.firstName && user.lastName && user.primaryEmailAddress?.emailAddress);
}

/**
 * Checks if the current user exists in the database
 */
export async function userExists(userId: string): Promise<boolean> {
  try {
    const user = await getUserById(userId);
    return !!user;
  } catch (error) {
    return false;
  }
}
