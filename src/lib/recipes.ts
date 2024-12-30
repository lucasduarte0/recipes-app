'use server';
import { Cuisine, Prisma } from '@prisma/client';
import prisma from './db';

export async function searchRecipes(searchTerm: string, skip = 0, take = 10) {
  const where: Prisma.RecipeWhereInput = searchTerm.trim()
    ? {
        name: {
          contains: searchTerm.trim(),
          mode: 'insensitive' as const,
        },
      }
    : {};

  const select: Prisma.RecipeSelect = {
    id: true,
    name: true,
    image: true,
    rating: true,
    difficulty: true,
    prepTimeMinutes: true,
    user: {
      select: {
        username: true,
        imageUrl: true,
      },
    },
  };

  const recipes = await prisma.recipe.findMany({
    where,
    select,
    take,
    skip,
    orderBy: {
      createdAt: 'desc',
    },
  });
  const total = await prisma.recipe.count({ where });

  console.log(`Found ${recipes.length} recipes for "${searchTerm}"`);

  return { recipes, total, take };
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
