import { LucideIcon } from "lucide-react";

export interface Recipe {
  id: number;
  name: string;
  ingredients?: string[];
  instructions?: string[];
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  servings?: number;
  difficulty?: string;
  cuisine?: string;
  caloriesPerServing?: number;
  tags?: string[];
  userId?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  mealType?: string[];
}

export interface RecipeWithPagination {
  recipes: Recipe[];
  total: number;
  skip: number;
  limit: number;
}

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
