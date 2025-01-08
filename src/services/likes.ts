'use server';

import prisma from '@/lib/db';

export type LikeStatus = {
  isLiked: boolean;
  likeCount: number;
};

export async function getLikeStatus(
  recipeId: number,
  userId: string | null
): Promise<LikeStatus> {
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    select: {
      recipeLikes: {
        where: userId ? { userId } : undefined,
        take: 1,
      },
      _count: {
        select: {
          recipeLikes: true,
        },
      },
    },
  });

  if (!recipe) {
    return {
      isLiked: false,
      likeCount: 0,
    };
  }

  return {
    isLiked: recipe.recipeLikes.length > 0,
    likeCount: recipe._count.recipeLikes,
  };
}

export async function toggleLike(recipeId: number, userId: string) {
  const existingLike = await prisma.recipeLike.findUnique({
    where: {
      userId_recipeId: {
        userId,
        recipeId,
      },
    },
  });

  if (existingLike) {
    await prisma.recipeLike.delete({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    });
    return false; // Not liked anymore
  } else {
    await prisma.recipeLike.create({
      data: {
        userId,
        recipeId,
      },
    });
    return true; // Now liked
  }
}

