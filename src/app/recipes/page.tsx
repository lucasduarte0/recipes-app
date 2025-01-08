import { Suspense } from 'react';
import { getRecipes, parseFilters } from '@/services/recipes';
import { RecipesGrid } from '@/components/recipe-card/RecipesGrid';
import { Loader2 } from 'lucide-react';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ searchParams }: PageProps) {
  // Await the search params promise
  const resolvedParams = await searchParams;
  
  // Parse search term and filters from URL
  const searchTerm = typeof resolvedParams.search === 'string' ? resolvedParams.search : '';
  const filters = await parseFilters(resolvedParams);
  
  // Fetch initial data
  const initialData = await getRecipes(searchTerm, filters, 0, 20);

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] grid place-items-start gap-5 py-8 sm:py-12">
        <Suspense fallback={
          <div className="w-full flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        }>
          <RecipesGrid 
            searchParams={resolvedParams}
            initialData={initialData}
            filters={filters}
          />
        </Suspense>
      </main>
    </div>
  );
}
