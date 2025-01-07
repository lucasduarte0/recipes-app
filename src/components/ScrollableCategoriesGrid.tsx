'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import Link from 'next/link';

interface Cuisine {
  name: string;
  image?: string | null;
  id: number;
  description: string | null;
}

interface ScrollableCategoriesGridProps {
  cuisines: Cuisine[];
}

export function ScrollableCategoriesGrid({
  cuisines,
}: ScrollableCategoriesGridProps) {
  return (
    <div className="relative w-full max-w-[min(calc(100vw-2rem),1536px)] mx-auto">
      <ScrollArea className="w-full">
        <div className="flex space-x-4 w-max">
          {cuisines.map((cuisine) => (
            <Card key={cuisine.id} className="w-[160px] shrink-0">
              <Link href={`/recipes?cuisine=${cuisine.name}`}>
                <CardContent className="p-0">
                  <div className="relative h-[100px] w-full">
                    <Image
                      src={cuisine.image || '/placeholder.png'}
                      alt={`Photo by ${cuisine.name}`}
                      className="object-cover rounded-t-md"
                      fill
                      sizes="160px"
                    />
                  </div>
                </CardContent>
                <CardFooter className="p-1.5">
                  <p className="text-sm font-medium truncate w-full text-center">
                    {cuisine.name}
                  </p>
                </CardFooter>
              </Link>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
