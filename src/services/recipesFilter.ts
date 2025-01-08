'use server';

import { Prisma } from '@prisma/client';
import { searchRecipes as searchRecipesDb } from '@/services/recipes';
import { cache } from 'react';

export type RecipeFilters = {
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  reviewCount?: number;
  rating?: number;
  difficulty?: string;
  cuisine?: string;
  tags?: string[];
  mealType?: string[];
};

// Cache the search results for 1 minute
export const getRecipes = cache(
  async (
    searchTerm: string = '',
    filters: RecipeFilters = {},
    page: number = 0,
    pageSize: number = 20
  ) => {
    const where: Prisma.RecipeWhereInput = {};

    // Add numeric filters
    if (filters.prepTime) where.prepTimeMinutes = { lte: filters.prepTime };
    if (filters.cookTime) where.cookTimeMinutes = { lte: filters.cookTime };
    if (filters.servings) where.servings = filters.servings;
    if (filters.rating) where.rating = { gte: filters.rating };
    if (filters.reviewCount) where.reviewCount = { gte: filters.reviewCount };

    // Add string filters
    if (filters.difficulty?.trim())
      where.difficulty = filters.difficulty.trim();
    if (filters.cuisine?.trim()) where.cuisine = filters.cuisine.trim();

    // Add array filters
    if (filters.tags?.length) where.tags = { hasEvery: filters.tags };
    if (filters.mealType?.length)
      where.mealType = { hasEvery: filters.mealType };

    try {
      const skip = page * pageSize;
      const result = await searchRecipesDb(
        { searchTerm, where },
        skip,
        pageSize
      );

      return {
        recipes: result.recipes,
        pagination: {
          total: result.total,
          pageSize: result.take,
          currentPage: page,
          totalPages: Math.ceil(result.total / pageSize),
          hasMore: skip + result.take < result.total,
        },
      };
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw new Error('Failed to fetch recipes');
    }
  }
);

// Helper to parse and validate filters from URL search params
export async function parseFilters(searchParams: {
  [key: string]: string | string[] | undefined;
}): Promise<RecipeFilters> {
  const filters: RecipeFilters = {};

  // Helper to parse number
  const parseNumber = (value: string | undefined): number | undefined => {
    if (!value) return undefined;
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  };

  // Helper to parse array
  const parseArray = (
    value: string | string[] | undefined
  ): string[] | undefined => {
    if (!value) return undefined;
    const arr = Array.isArray(value) ? value : value.split(',');
    return arr.filter(Boolean).map((item) => item.trim());
  };

  // Parse numeric filters
  filters.prepTime = parseNumber(searchParams.prepTime?.toString());
  filters.cookTime = parseNumber(searchParams.cookTime?.toString());
  filters.servings = parseNumber(searchParams.servings?.toString());
  filters.rating = parseNumber(searchParams.rating?.toString());
  filters.reviewCount = parseNumber(searchParams.reviewCount?.toString());

  // Parse string filters
  filters.difficulty = searchParams.difficulty?.toString();
  filters.cuisine = searchParams.cuisine?.toString();

  // Parse array filters
  filters.tags = parseArray(searchParams.tags);
  filters.mealType = parseArray(searchParams.mealType);

  return filters;
}

// Server action for fetching more recipes
export async function fetchMoreRecipes(
  searchTerm: string,
  filters: RecipeFilters,
  page: number
) {
  return getRecipes(searchTerm, filters, page);
}
