import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { getCuisines, getRecipes } from '@/lib/recipes';
import { Clock } from 'lucide-react';
import { RecipeCard } from '@/components/recipe-card/RecipeCard';
import { ScrollableCategoriesGrid } from '@/components/ScrollableCategoriesGrid';

export default async function HomePage() {
  const cuisines = await getCuisines();

  const popularRecipes = await getRecipes({
    where: {
      AND: [
        {
          rating: {
            gte: 4,
          },
        },
        {
          reviewCount: {
            not: null,
          },
        },
      ],
    },
    orderBy: [
      {
        reviewCount: 'desc',
      },
      {
        rating: 'desc',
      },
    ],
    take: 5,
  });

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] grid place-items-start gap-5 py-8 sm:py-12">
        <Navbar />
        {/* Quick Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button variant="outline" size="sm" className="rounded-full">
            <Clock className="mr-2 h-4 w-4" />
            Quick ({`<`} 30 min)
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            Easy
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            Popular
          </Button>
        </div>

        {/* Popular Recipes */}
        <section className="w-full">
          <h2 className="text-lg font-semibold mb-4">Popular Recipes</h2>
          <div className="relative space-y-4 w-full">
            <ScrollableCategoriesGrid cuisines={cuisines} />
          </div>
        </section>

        {/* Popular Recipes */}
        <section className="w-full">
          <h2 className="text-lg font-semibold mb-4">Popular Recipes</h2>
          <div className="relative space-y-4 w-full">
            {popularRecipes.map((recipe) => (
              <div key={recipe.id} className="relative">
                <RecipeCard
                  className="w-full"
                  recipe={recipe}
                  imageClassName="w-full"
                  imageAspectRatio="video">
                  <h2 className="text-lg font-playful font-semibold">
                    {recipe.name}
                  </h2>
                </RecipeCard>
              </div>
            ))}
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}
