// import Navbar from '@/components/Navbar';
import { RecipesGrid } from '@/components/recipe-card/RecipesGrid';
import { Suspense } from 'react';

interface RecipesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page(props: RecipesPageProps) {
  const searchParams = await props.searchParams;
  const { query } = searchParams;

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] grid place-items-start gap-5 py-8 sm:py-12">
        <Suspense fallback={<div>Loading...</div>}>
          <RecipesGrid query={query} />
        </Suspense>
      </main>
    </div>
  );
}
