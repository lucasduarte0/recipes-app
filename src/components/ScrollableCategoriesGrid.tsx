'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

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
    <ScrollArea className="h-auto max-w-[calc(100vw-2rem)] md:max-w-[calc(100vw-4rem)] lg:max-w-[1024px] xl:max-w-[1280px] 2xl:max-w-[1536px] mx-auto">
      <div className="flex space-x-4  w-max">
        {cuisines.map((cuisine) => (
          <Card key={cuisine.id} className="w-[160px] shrink-0">
            <CardContent className="p-0">
              <Image
                src={cuisine.image || '/placeholder.png'}
                alt={`Photo by ${cuisine.name}`}
                className="h-[100px] w-full object-cover rounded-t-md"
                width={160}
                height={100}
              />
            </CardContent>
            <CardFooter className="p-1.5">
              <p className="text-sm font-medium truncate w-full text-center">
                {cuisine.name}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
