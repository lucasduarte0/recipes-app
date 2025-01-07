'use client';
import RecipesCards from '@/components/recipe-card/RecipesCards';
import Search from '@/components/Search';
import { useQueryState, parseAsString } from 'nuqs';
import { useMemo } from 'react';
import { Prisma } from '@prisma/client';

interface RecipesGridProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export function RecipesGrid({ searchParams }: RecipesGridProps) {
  // Search term with initial value from searchParams
  const [searchTerm, setSearchTerm] = useQueryState(
    'search',
    parseAsString.withDefault(
      typeof searchParams.search === 'string' ? searchParams.search : ''
    )
  );

  // All filters as strings with initial values from searchParams
  const [prepTimeStr] = useQueryState(
    'prepTime',
    parseAsString.withDefault(
      typeof searchParams.prepTime === 'string' ? searchParams.prepTime : ''
    )
  );
  const [cookTimeStr] = useQueryState(
    'cookTime',
    parseAsString.withDefault(
      typeof searchParams.cookTime === 'string' ? searchParams.cookTime : ''
    )
  );
  const [servingsStr] = useQueryState(
    'servings',
    parseAsString.withDefault(
      typeof searchParams.servings === 'string' ? searchParams.servings : ''
    )
  );
  const [reviewCountStr] = useQueryState(
    'reviewCount',
    parseAsString.withDefault(
      typeof searchParams.reviewCount === 'string'
        ? searchParams.reviewCount
        : ''
    )
  );
  const [ratingStr] = useQueryState(
    'rating',
    parseAsString.withDefault(
      typeof searchParams.rating === 'string' ? searchParams.rating : ''
    )
  );
  const [difficulty] = useQueryState(
    'difficulty',
    parseAsString.withDefault(
      typeof searchParams.difficulty === 'string' ? searchParams.difficulty : ''
    )
  );
  const [cuisine] = useQueryState(
    'cuisine',
    parseAsString.withDefault(
      typeof searchParams.cuisine === 'string' ? searchParams.cuisine : ''
    )
  );
  const [tagsStr] = useQueryState(
    'tags',
    parseAsString.withDefault(
      Array.isArray(searchParams.tags)
        ? searchParams.tags.join(',')
        : typeof searchParams.tags === 'string'
        ? searchParams.tags
        : ''
    )
  );
  const [mealTypeStr] = useQueryState(
    'mealType',
    parseAsString.withDefault(
      Array.isArray(searchParams.mealType)
        ? searchParams.mealType.join(',')
        : typeof searchParams.mealType === 'string'
        ? searchParams.mealType
        : ''
    )
  );

  // Parse numeric and array values with validation
  const parsedValues = useMemo(() => {
    const parseNumber = (value: string | undefined, parser: (val: string) => number) => {
      if (!value) return undefined;
      const parsed = parser(value);
      return isNaN(parsed) ? undefined : parsed;
    };

    const parseArray = (value: string | undefined): string[] => {
      if (!value) return [];
      return value.split(',').filter(Boolean).map(item => item.trim());
    };

    return {
      prepTime: parseNumber(prepTimeStr, str => parseInt(str, 10)),
      cookTime: parseNumber(cookTimeStr, str => parseInt(str, 10)),
      servings: parseNumber(servingsStr, str => parseInt(str, 10)),
      reviewCount: parseNumber(reviewCountStr, str => parseInt(str, 10)),
      rating: parseNumber(ratingStr, parseFloat),
      tags: parseArray(tagsStr),
      mealType: parseArray(mealTypeStr),
    };
  }, [prepTimeStr, cookTimeStr, servingsStr, reviewCountStr, ratingStr, tagsStr, mealTypeStr]);

  // Construct where clause based on URL parameters with type safety
  const where = useMemo(() => {
    const filters: Prisma.RecipeWhereInput = {};
    const {
      prepTime,
      cookTime,
      servings,
      reviewCount,
      rating,
      tags,
      mealType,
    } = parsedValues;

    // Add numeric filters only if they are valid numbers
    if (typeof prepTime === 'number') filters.prepTimeMinutes = { lte: prepTime };
    if (typeof cookTime === 'number') filters.cookTimeMinutes = { lte: cookTime };
    if (typeof servings === 'number') filters.servings = servings;
    if (typeof rating === 'number') filters.rating = { gte: rating };
    if (typeof reviewCount === 'number') filters.reviewCount = { gte: reviewCount };

    // Add string filters only if they are non-empty
    if (difficulty?.trim()) filters.difficulty = difficulty.trim();
    if (cuisine?.trim()) filters.cuisine = cuisine.trim();

    // Add array filters only if they contain values
    if (tags.length > 0) filters.tags = { hasEvery: tags };
    if (mealType.length > 0) filters.mealType = { hasEvery: mealType };

    return Object.keys(filters).length > 0 ? filters : undefined;
  }, [parsedValues, difficulty, cuisine]);

  return (
    <div className="w-full space-y-4">
      <Search value={searchTerm} onChange={setSearchTerm} />
      <RecipesCards searchTerm={searchTerm} where={where} />
    </div>
  );
}
