import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Recipe } from '@prisma/client';
import { RecipeBadges } from './RecipeBadges';
import { cn } from '@/lib/utils';

interface RecipeCardProps {
  recipe: Partial<Recipe>;
  children: React.ReactNode;
  badges?: boolean;
  className?: string;
  imageClassName?: string;
  imageAspectRatio?: 'square' | 'video' | 'wide';
  imageHeight?: string;
  cardClassName?: string;
}

export function RecipeCard({
  recipe,
  children,
  badges = false,
  className,
  imageClassName,
  imageAspectRatio = 'video', // 16:9 default
  imageHeight = 'h-full w-full', // default from original
  cardClassName,
}: RecipeCardProps) {
  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
  };

  return (
    <div className={cn('space-y-1.5 w-full', className)}>
      <Link href={`/recipes/${recipe.id}`} passHref>
        <Card
          className={cn(
            'w-full p-0 overflow-hidden rounded-2xl border shadow-sm hover:shadow-lg transition-shadow duration-200',
            cardClassName
          )}>
          {badges && (
            <RecipeBadges
              rating={recipe.rating ?? 5}
              difficulty={recipe.difficulty ?? 'Easy'}
              prepTimeMinutes={recipe.prepTimeMinutes ?? 30}
            />
          )}
          <CardContent className="p-0">
            <div className={aspectRatioClasses[imageAspectRatio]}>
              {recipe.image && (
                <Image
                  className={cn('object-cover', imageHeight, imageClassName)}
                  src={recipe.image}
                  width={350}
                  height={350}
                  alt={recipe.name || 'Recipe Image'}
                  priority={true}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
      {children}
      {/* <h2 className={cn('text-xl font-playful font-semibold', titleClassName)}>
        {recipe.name}
      </h2> */}
    </div>
  );
}
