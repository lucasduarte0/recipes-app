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
    _count: {
      select: {
        recipeLikes: true;
      };
    };
  };
}>;

// Create a new type with the extra userHasLiked field
export type RecipeWithUserAndLikeFlag = RecipeWithUser & {
  hasUserLiked?: boolean;
};

export type RecipeWhereInput = Prisma.RecipeWhereInput;
