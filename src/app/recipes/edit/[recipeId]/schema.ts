import { z } from 'zod';

export const recipeFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Recipe name must be at least 2 characters.',
  }),
  ingredients: z
    .array(z.string())
    .min(1, {
      message: 'Add at least one ingredient.',
    })
    .optional(),
  instructions: z
    .array(z.string())
    .min(1, {
      message: 'Add at least one instruction.',
    })
    .optional(),
  prepTimeMinutes: z.number().min(0).optional(),
  cookTimeMinutes: z.number().min(0).optional(),
  servings: z.number().min(1).optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
  cuisine: z
    .string()
    .min(2, {
      message: 'Cuisine must be at least 2 characters.',
    })
    .optional(),
  caloriesPerServing: z.number().min(0).optional(),
  tags: z.array(z.string()).default([]),
  image: z
    .string()
    .url({
      message: 'Please enter a valid URL.',
    })
    .optional(),
  mealType: z
    .array(z.string())
    .min(1, {
      message: 'Select at least one meal type.',
    })
    .optional(),
});

export type RecipeFormValues = z.infer<typeof recipeFormSchema>;
