'use server';

import { Cuisine, Prisma } from '@prisma/client';
import prisma from '../lib/db';
import { DEFAULT_PAGE_SIZE, DEFAULT_POPULAR_RECIPES_COUNT } from '@/lib/constants';

const DEFAULT_RECIPE_SELECT: Prisma.RecipeSelect = {
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

async function verifyRecipeOwnership(id: number, userId: string) {
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!recipe || recipe.userId !== userId) {
    throw new Error('Unauthorized');
  }

  return recipe;
}

export async function searchRecipes({
  searchTerm = '',
  where = {},
  page = 0, // Change the default page to 0
  pageSize = DEFAULT_PAGE_SIZE,
  userId,
}: {
  searchTerm?: string;
  where?: Prisma.RecipeWhereInput;
  page?: number;
  pageSize?: number;
  userId?: string;
}) {
  // Make a console time start here
  const performanceStart = performance.now(); // Start time measurement
  const skip = page * pageSize; // Adjust the skip calculation

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

  const finalWhere: Prisma.RecipeWhereInput = {
    AND: [searchFilter, where].filter(Boolean),
  };

  // Use aggregation to get both data and count in a single query
  const recipes = await prisma.recipe.findMany({
    where: finalWhere,
    select: {
      ...DEFAULT_RECIPE_SELECT,
      _count: {
        select: {
          recipeLikes: true,
        },
      },
      recipeLikes: userId
        ? {
            where: { userId },
            select: { userId: true },
          }
        : undefined,
    },
    take: pageSize + 1, // Take one extra to determine if there's more
    skip,
    orderBy: { createdAt: 'desc' },
  });

  // Determine if there's more data to load
  const hasMore = recipes.length > pageSize;
  // Remove the extra recipe if there's more data to load
  const actualRecipes = hasMore ? recipes.slice(0, -1) : recipes;

  // Add if userHasLiked to each recipe
  const transformedRecipes = actualRecipes.map((recipe) => ({
    ...recipe,
    hasUserLiked: recipe.recipeLikes?.length > 0,
  }));

  // Consote performance end here and log it
  const performanceEnd = performance.now();
  console.log(`Performance: ${performanceEnd - performanceStart}ms`);

  return {
    recipes: transformedRecipes,
    total: skip + actualRecipes.length + (hasMore ? 1 : 0),
    pageSize,
    hasMore,
  };
}

export async function getRecipeById(id: number) {
  const recipe = await prisma.recipe.findUnique({
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

  if (!recipe) {
    throw new Error('Recipe not found');
  }

  return recipe;
}

export async function createRecipe(userId: string, data: Omit<Prisma.RecipeUncheckedCreateInput, 'userId'>) {
  return prisma.recipe.create({
    data: { ...data, userId },
  });
}

export async function updateRecipe(id: number, userId: string, data: Prisma.RecipeUpdateInput) {
  await verifyRecipeOwnership(id, userId);
  return prisma.recipe.update({
    where: { id },
    data,
  });
}

export async function getPopularRecipes(limit = DEFAULT_POPULAR_RECIPES_COUNT) {
  return prisma.recipe.findMany({
    where: {
      AND: [{ rating: { gte: 4 } }, { reviewCount: { not: null } }],
    },
    orderBy: [{ reviewCount: 'desc' }, { rating: 'desc' }],
    select: {
      ...DEFAULT_RECIPE_SELECT,
      recipeLikes: {
        select: { userId: true },
      },
      _count: {
        select: { recipeLikes: true },
      },
    },
    take: limit,
  });
}

export async function getCuisines(): Promise<Cuisine[]> {
  return prisma.cuisine.findMany();
}
