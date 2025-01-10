import { FilterSelector } from '@/components/FilterSelector';
import { SearchBar } from '@/components/SearchBar';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="min-h-screen pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] grid place-items-start gap-5 py-8 sm:py-12">
        <SearchBar />
        <FilterSelector />
        <div className="w-full flex justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        </div>
      </main>
    </div>
  );
}
