import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/card';
import { Cuisine } from '@prisma/client';
import { supabaseLoader } from '@/lib/utils';
import Link from 'next/link';

export function CategoriesGrid({ cuisines }: { cuisines: Cuisine[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {cuisines.map((cuisine: Cuisine) => (
        <Card
          key={cuisine.id}
          className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          // onClick={() => handleCategoryClick(category)}
        >
          <Link href={`/recipes?cuisine=${cuisine.name}`}>
            <div className="aspect-video relative">
              <Image
                src={
                  cuisine.image
                    ? supabaseLoader({
                        url: cuisine.image,
                        width: 200,
                        quality: 75,
                      })
                    : 'https://via.placeholder.com/200'
                }
                alt={cuisine.description ?? ''}
                height={200}
                width={200}
                className="object-cover w-full h-full"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{cuisine.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {cuisine.name} recipes
                  </p>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
}
