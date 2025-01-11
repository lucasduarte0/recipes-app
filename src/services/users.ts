import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export type UserWithFollow = Prisma.UserGetPayload<{
  include: {
    _count: {
      select: {
        followers: true;
        following: true;
      };
    };
  };
}>;

export type UserWithRecipes = Prisma.UserGetPayload<{
  include: {
    _count: {
      select: {
        followers: true;
        following: true;
      };
    };
    recipes: true;
  };
}>;

type UpdateUserData = Partial<Omit<Prisma.UserUpdateInput, 'email'>>;

interface SearchUsersParams {
  query: string;
  page?: number;
  limit?: number;
  excludeUserId?: string;
}

interface GetUserActivityParams {
  userId: string;
  limit?: number;
}

/**
 * Create a new user
 */
export async function createUser(userData: Prisma.UserCreateInput) {
  try {
    const user = await prisma.user.create({
      data: userData,
    });
    return user;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('Username or email already exists');
      }
    }
    throw new Error('Failed to create user');
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string, args: Omit<Prisma.UserFindUniqueArgs, 'where'> = {}) {
  const user = await prisma.user.findUnique({
    ...args,
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

/**
 * Get user by ID with recipes and follower counts
 */
export async function getUserWithRecipesAndCounts(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      recipes: true,
      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

/**
 * Get user by username
 */
export async function getUserByUsername(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      _count: {
        select: {
          recipes: true,
          followers: true,
          following: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

/**
 * Update user profile
 */
export async function updateUser(userId: string, userData: UpdateUserData) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: userData,
    });
    return user;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('Username already exists');
      }
    }
    throw new Error('Failed to update user');
  }
}

/**
 * Delete user
 */
export async function deleteUser(userId: string) {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
  } catch (error) {
    throw new Error('Failed to delete user');
  }
}

/**
 * Search users with pagination
 */
export async function searchUsers({ query, page = 1, limit = 10, excludeUserId }: SearchUsersParams) {
  const where: Prisma.UserWhereInput = {
    AND: [
      {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
        ],
      },
      excludeUserId ? { id: { not: excludeUserId } } : {},
    ],
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        imageUrl: true,
        bio: true,
        _count: {
          select: {
            followers: true,
            following: true,
            recipes: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        username: 'asc',
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      total,
      pages: Math.ceil(total / limit),
      page,
      limit,
    },
  };
}

/**
 * Get user's recent activity
 */
export async function getUserActivity({ userId, limit = 10 }: GetUserActivityParams) {
  const [recentRecipes, recentLikes] = await Promise.all([
    prisma.recipe.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        name: true,
        image: true,
        createdAt: true,
      },
    }),
    prisma.recipeLike.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        recipe: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    }),
  ]);

  return {
    recentRecipes,
    recentLikes,
  };
}

/**
 * Get user stats
 */
export async function getUserStats(userId: string) {
  const stats = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      _count: {
        select: {
          recipes: true,
          recipeLikes: true,
          followers: true,
          following: true,
        },
      },
    },
  });

  if (!stats) {
    throw new Error('User not found');
  }

  return stats._count;
}

/**
 * Check if username is available
 */
export async function isUsernameAvailable(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  return { available: !user };
}
