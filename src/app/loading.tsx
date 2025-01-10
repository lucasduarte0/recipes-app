import { Skeleton } from '@/components/ui/skeleton';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function HomeLoading() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 grid place-items-start gap-5 py-8 sm:py-12">
        <Navbar />
        {/* Quick Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Skeleton className="w-32 h-9 rounded-full" />
          <Skeleton className="w-24 h-9 rounded-full" />
          <Skeleton className="w-28 h-9 rounded-full" />
        </div>

        {/* Categories Section */}
        <section className="w-full max-w-full overflow-hidden">
          <Skeleton className="w-48 h-7 mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="w-full h-24 rounded-lg" />
            ))}
          </div>
        </section>

        {/* Popular Recipes */}
        <section className="w-full">
          <Skeleton className="w-48 h-7 mb-4" />
          <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="w-full aspect-video rounded-lg" />
                <div className="flex justify-between items-start w-full">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="w-32 h-5" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-6 h-6 rounded-full" />
                      <Skeleton className="w-24 h-4" />
                    </div>
                  </div>
                  <Skeleton className="w-8 h-8 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}
