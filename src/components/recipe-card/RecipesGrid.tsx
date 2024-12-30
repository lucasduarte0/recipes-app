'use client';
import RecipesCards from '@/components/recipe-card/RecipesCards';
import Search from '@/components/Search';
import { useQueryState, parseAsString } from 'nuqs';

export function RecipesGrid({ query }: any) {
  const [searchTerm, setSearchTerm] = useQueryState(
    'search',
    parseAsString.withDefault('')
  );

  return (
    <div className="w-full space-y-4">
      <Search value={searchTerm} onChange={setSearchTerm} />
      <RecipesCards searchTerm={searchTerm} />
    </div>
  );
}
