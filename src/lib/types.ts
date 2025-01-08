import { Prisma } from '@prisma/client';
import { LucideIcon } from 'lucide-react';

// export interface User {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   imageUrl: string;
//   username: string;
//   recipes: Recipe[];
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface Recipe {
//   id: number;
//   name: string;
//   ingredients?: string[];
//   instructions?: string[];
//   prepTimeMinutes?: number;
//   cookTimeMinutes?: number;
//   servings?: number;
//   difficulty?: string;
//   cuisine?: string;
//   caloriesPerServing?: number;
//   tags?: string[];
//   image: string;
//   rating?: number;
//   reviewCount?: number;
//   mealType?: string[];

//   categories: Category[];

//   userId: string;

//   createdAt?: Date;
//   updatedAt?: Date;
// }

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
