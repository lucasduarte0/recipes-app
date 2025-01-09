import { parseAsFloat, createSearchParamsCache, parseAsInteger, parseAsString, parseAsArrayOf } from 'nuqs/server';

// 1. Define a comprehensive search parameters schema
export const searchParamsSchema = {
  // Numeric recipe filters
  prepTime: parseAsInteger,
  cookTime: parseAsInteger,
  servings: parseAsInteger,
  rating: parseAsInteger,
  reviewCount: parseAsInteger,

  // String recipe filters
  difficulty: parseAsString,
  cuisine: parseAsString,

  // Search term
  search: parseAsString,
};

export const loadSearchParams = createSearchParamsCache(searchParamsSchema);
