'use client';

import { CategoriesGrid } from '@/components/CategoriesGrid';
import RecipesCards from '@/components/recipe-card/RecipesCards';
import Search from '@/components/Search';
import { Button } from '@/components/ui/button';
import { Cuisine } from '@prisma/client';
import { useRouter } from 'next/navigation';

import { Clock, ChefHat, Flame } from 'lucide-react';
import { useState, useCallback } from 'react';

interface FilterParams {
  [key: string]: string;
}

interface Filter {
  icon: React.ElementType;
  label: string;
  params: FilterParams;
}

const filters: Filter[] = [
  { icon: Clock, label: 'Quick (< 30 min)', params: { prepTime: '30' } },
  { icon: ChefHat, label: 'Easy', params: { difficulty: 'Easy' } },
  { icon: Flame, label: 'Popular', params: { rating: '4.5', reviewCount: '10' } },
];

interface SearchPageClientProps {
  cuisines: Cuisine[];
}

export default function SearchPageClient({ cuisines }: SearchPageClientProps) {
  const router = useRouter();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const buildQueryString = useCallback((activeFilterLabels: string[]) => {
    const params = new URLSearchParams();
    
    // Add search query if present
    if (searchQuery) {
      params.set('search', searchQuery);
    }

    // Add filter parameters
    activeFilterLabels.forEach(filterLabel => {
      const filter = filters.find(f => f.label === filterLabel);
      if (filter) {
        Object.entries(filter.params).forEach(([key, value]) => {
          params.set(key, value);
        });
      }
    });

    return params.toString();
  }, [searchQuery]);

  const toggleFilter = (filter: string) => {
    const newFilters = activeFilters.includes(filter)
      ? activeFilters.filter((f) => f !== filter)
      : [...activeFilters, filter];
    
    setActiveFilters(newFilters);
    
    // Redirect to recipes page with filters
    const queryString = buildQueryString(newFilters);
    router.push(`/recipes${queryString ? `?${queryString}` : ''}`);
  };
  return (
    <div className="container mx-auto pb-20 pt-4 space-y-6">
      {/* Search Input */}
      <Search value={searchQuery} onChange={setSearchQuery} />

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {filters.map(({ icon: Icon, label }) => (
          <Button
            key={label}
            variant={activeFilters.includes(label) ? 'default' : 'outline'}
            className="gap-2"
            onClick={() => toggleFilter(label)}>
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        ))}
      </div>

      {/* Categories */}
      {searchQuery.length > 0 ? (
        <RecipesCards searchTerm={searchQuery} />
      ) : (
        <CategoriesGrid cuisines={cuisines} />
      )}
    </div>
  );
}
