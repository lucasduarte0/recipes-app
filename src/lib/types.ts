import { Prisma } from '@prisma/client';
import { LucideIcon } from 'lucide-react';

export interface Category {
  name: string;
  image: string;
  description: string;
  count: number;
}

export interface Filter {
  icon: LucideIcon;
  label: string;
}

export type RecipeWithUser = Prisma.RecipeGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        username: true;
        imageUrl: true;
      };
    };
  };
}>;

export type RecipeWhereInput = Prisma.RecipeWhereInput;
