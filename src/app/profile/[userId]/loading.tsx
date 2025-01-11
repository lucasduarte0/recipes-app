import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function UserProfileLoading() {
  return (
    <main className="container max-w-lg mx-auto px-4 pb-20">
      {/* Profile Header */}
      <div className="flex flex-col items-center mt-8">
        <div className="relative">
          <Skeleton className="w-24 h-24 rounded-full" />
        </div>

        <Skeleton className="w-48 h-8 mt-4 rounded-full" />
        <Skeleton className="w-32 h-5 mt-2 rounded-full" />

        <Skeleton className="w-32 h-10 mt-4 rounded-full" />

        <Skeleton className="w-64 h-5 mt-4 rounded-full" />

        {/* Stats */}
        <div className="flex justify-center gap-8 mt-6 w-full">
          <div className="text-center">
            <Skeleton className="w-8 h-6 mx-auto rounded-full" />
            <Skeleton className="w-16 h-4 mt-1 rounded-full" />
          </div>
          <div className="text-center">
            <Skeleton className="w-8 h-6 mx-auto rounded-full" />
            <Skeleton className="w-16 h-4 mt-1 rounded-full" />
          </div>
          <div className="text-center">
            <Skeleton className="w-8 h-6 mx-auto rounded-full" />
            <Skeleton className="w-16 h-4 mt-1 rounded-full" />
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Recipes Section */}
      <div>
        <Skeleton className="w-32 h-7 mb-4 rounded-full" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="relative">
              <Skeleton className="w-full aspect-square rounded-lg" />
              <Skeleton className="w-3/4 h-5 mt-2 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}