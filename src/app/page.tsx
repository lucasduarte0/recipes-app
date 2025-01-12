export const dynamic = 'force-dynamic';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { RecipeCard } from '@/components/recipe-card/RecipeCard';
import { ScrollableCategoriesGrid } from '@/components/ScrollableCategoriesGrid';
// import { LikeButton } from '@/components/LikeButton';
// import { currentUser } from '@clerk/nextjs/server';
import { getCuisines } from '@/services/cuisines';
import { getPopularRecipes } from '@/services/recipes';
import { LikeButton } from '@/components/LikeButton';
import { getCurrentUser } from '@/services/auth';

export default async function HomePage() {
  const user = await getCurrentUser();
  const cuisines = await getCuisines();
  const popularRecipes = await getPopularRecipes(6);

  if (user) {
    console.log('User: ', user.id); // Log the user object to the console
  }

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 grid place-items-start gap-5 py-8 sm:py-12">
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
        <section className="w-full max-w-full overflow-hidden">
          <h2 className="text-lg font-semibold mb-4">Popular Recipes</h2>
          <div className="relative space-y-4 w-full">
            <ScrollableCategoriesGrid cuisines={cuisines} />
          </div>
        </section>

        {/* Popular Recipes */}
        <section className="w-full">
          <h2 className="text-lg font-semibold mb-4">Popular Recipes</h2>
          <div className="relative grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
            {popularRecipes.map((recipe) => (
              <div key={recipe.id}>
                <RecipeCard className="w-full" recipe={recipe} imageClassName="w-full" imageAspectRatio="video">
                  <div className="flex justify-between items-start w-full">
                    <div className="flex flex-col gap-1">
                      <h2 className="text-base font-playful font-semibold">{recipe.name}</h2>
                      {/* <div className="flex items-center gap-2">
                            {user.imageUrl && <AvatarImage src={user.imageUrl} />}
                          <AvatarFallback>
                            <User />
                          </AvatarFallback>
                        <span className="text-xs text-muted-foreground">{recipe.user.username}</span>
                      </div> */}
                    </div>

                    <div className="flex items-center gap-2 py-1">
                      <LikeButton
                        isLiked={recipe.hasUserLiked}
                        likeCount={recipe._count.recipeLikes}
                        recipeId={recipe.id}
                      />
                    </div>
                  </div>
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
