'use server';

import { Prisma } from '@prisma/client';
import { parseArray, parseNumber } from '@/lib/utils';

export type RecipeFilterParams = {
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
// Builds Prisma where clause from filter parameters
export const buildRecipeWhereClause = async (filters: RecipeFilterParams) => {
  const where: Prisma.RecipeWhereInput = {};

  // Numeric comparisons
  const numericFilters = {
    prepTimeMinutes: { value: filters.prepTime, operator: 'lte' },
    cookTimeMinutes: { value: filters.cookTime, operator: 'lte' },
    servings: { value: filters.servings, operator: 'equals' },
    rating: { value: filters.rating, operator: 'gte' },
    reviewCount: { value: filters.reviewCount, operator: 'gte' },
  } as const;

  // Apply numeric filters if values exist
  Object.entries(numericFilters).forEach(([key, config]) => {
    if (config.value) {
      where[key as keyof typeof numericFilters] = {
        [config.operator]: config.value,
      };
    }
  });

  // String equality checks with trimming
  if (filters.difficulty?.trim()) where.difficulty = filters.difficulty.trim();
  if (filters.cuisine?.trim()) where.cuisine = filters.cuisine.trim();

  // Array containment checks
  if (filters.tags?.length) where.tags = { hasEvery: filters.tags };
  if (filters.mealType?.length) where.mealType = { hasEvery: filters.mealType };

  return where;
};

// Helper to parse and validate filters from URL search params
export async function parseRecipeSearchFilters(searchParams: {
  [key: string]: string | string[] | undefined;
}): Promise<RecipeFilterParams> {
  const filters: RecipeFilterParams = {};

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