'use server';
import { Cuisine, Prisma } from '@prisma/client';
import prisma from './db';
import { createClerkSupabaseServer } from './supabase/server';

type RecipeFilters = {
  searchTerm?: string;
  where?: Prisma.RecipeWhereInput;
};

export async function searchRecipes(
  { searchTerm = '', where = {} }: RecipeFilters,
  skip = 0,
  take = 10
) {
  // Combine search term filter with provided where clause
  const searchFilter: Prisma.RecipeWhereInput = searchTerm.trim()
    ? {
        OR: [
          {
            name: {
              contains: searchTerm.trim(),
              mode: 'insensitive' as const,
            },
          },
          {
            tags: {
              has: searchTerm.trim(),
            },
          },
        ],
      }
    : {};

  // Combine all filters using AND
  const finalWhere: Prisma.RecipeWhereInput = {
    AND: [
      searchFilter,
      where, // Include the provided where clause
    ].filter(Boolean), // Remove empty filters
  };

  const select: Prisma.RecipeSelect = {
    id: true,
    name: true,
    image: true,
    prepTimeMinutes: true,
    cookTimeMinutes: true,
    servings: true,
    difficulty: true,
    cuisine: true,
    rating: true,
    reviewCount: true,
    tags: true,
    mealType: true,
    user: {
      select: {
        id: true,
        username: true,
        imageUrl: true,
      },
    },
  };

  const recipes = await prisma.recipe.findMany({
    where: finalWhere,
    select,
    take,
    skip,
    orderBy: {
      createdAt: 'desc',
    },
  });
  const total = await prisma.recipe.count({ where: finalWhere });

  console.log(`Found ${recipes.length} recipes matching the criteria`);

  return { recipes, total, take };
}

// Get Recipes
export async function getRecipes<T extends Prisma.RecipeFindManyArgs>(
  args: T
): Promise<Prisma.RecipeGetPayload<T>[]> {
  return (await prisma.recipe.findMany(args)) as Prisma.RecipeGetPayload<T>[];
}

export async function getAllRecipes() {
  return await prisma.recipe.findMany();
}

export async function getCuisines(): Promise<Cuisine[]> {
  const cuisines = await prisma.cuisine.findMany();

  return cuisines;
}

export async function getRecipeById(id: number) {
  return await prisma.recipe.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          imageUrl: true,
        },
      },
      categories: true,
    },
  });
}

export async function updateRecipe(
  id: number,
  userId: string,
  data: Prisma.RecipeUpdateInput
) {
  // Verify ownership
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!recipe || recipe.userId !== userId) {
    throw new Error('Unauthorized');
  }

  return await prisma.recipe.update({
    where: { id },
    data,
  });
}

export async function createRecipe(
  userId: string,
  data: Omit<Prisma.RecipeUncheckedCreateInput, 'userId'>
) {
  return await prisma.recipe.create({
    data: {
      ...data,
      userId,
    },
  });
}

export async function uploadImage(file: File, fileName: string) {
  const supabase = await createClerkSupabaseServer();
  const { data, error } = await supabase.storage
    .from('recipes')
    .upload(`${fileName}.png`, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }
  return data;
}

type LikeStatus = {
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
