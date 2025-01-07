// import Navbar from '@/components/Navbar';
import { RecipesGrid } from '@/components/recipe-card/RecipesGrid';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] grid place-items-start gap-5 py-8 sm:py-12">
        <RecipesGrid searchParams={resolvedParams} />
      </main>
    </div>
  );
}
