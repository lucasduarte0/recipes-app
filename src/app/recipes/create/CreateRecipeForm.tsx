'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Cuisine } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createRecipe } from '@/lib/recipes';
import { RecipeFormValues, recipeFormSchema } from '../edit/[recipeId]/schema';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';
import { ListField } from '@/components/ui/list-field';
import { TagsInput } from '@/components/ui/tags-input';
import { MultiSelect } from '@/components/ui/multi-select';

interface CreateRecipeFormProps {
  userId: string;
  cuisines: Cuisine[];
}

const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard'] as const;
const MEAL_TYPES = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snack',
  'Dessert',
] as const;

export function CreateRecipeForm({ userId, cuisines }: CreateRecipeFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      name: '',
      ingredients: [],
      instructions: [],
      prepTimeMinutes: 0,
      cookTimeMinutes: 0,
      servings: 1,
      difficulty: 'Medium',
      cuisine: 'American',
      caloriesPerServing: 0,
      tags: [],
      mealType: [],
    },
  });

  async function onSubmit(data: RecipeFormValues) {
    setIsLoading(true);
    try {
      // Ensure required fields are present
      const recipeData = {
        name: data.name,
        cuisine: data.cuisine || 'American', // Ensure cuisine is never undefined
        ingredients: data.ingredients || [],
        instructions: data.instructions || [],
        prepTimeMinutes: data.prepTimeMinutes,
        cookTimeMinutes: data.cookTimeMinutes,
        servings: data.servings,
        difficulty: data.difficulty,
        caloriesPerServing: data.caloriesPerServing,
        tags: data.tags,
        mealType: data.mealType || [],
        image: '/placeholder-recipe.jpg',
      };
      
      const recipe = await createRecipe(userId, recipeData);
      router.push(`/recipes/${recipe.id}`);
      router.refresh();
    } catch (error) {
      console.error('Failed to create recipe:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipe Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter recipe name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ListField
          form={form}
          name="ingredients"
          label="Ingredients"
          placeholder="Add ingredient"
        />
        <Separator />
        <ListField
          form={form}
          name="instructions"
          label="Instructions"
          placeholder="Add instruction"
          showNumbers
        />

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="prepTimeMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prep Time (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(+e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cookTimeMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cook Time (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(+e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="servings"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Servings</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(+e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="caloriesPerServing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Calories per Serving</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(+e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {DIFFICULTY_OPTIONS.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mealType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meal Type</FormLabel>
              <MultiSelect
                options={MEAL_TYPES.map((type) => ({
                  label: type,
                  value: type,
                }))}
                onValueChange={field.onChange}
                defaultValue={field.value}
                placeholder="Select Meal Type(s)"
                variant="secondary"
                maxCount={3}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <TagsInput
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Tags"
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cuisine"
          render={({ field }) => (
            <Combobox
              className="w-full"
              options={cuisines.map((cuisine) => ({
                label: cuisine.name,
                value: cuisine.name,
              }))}
              value={field.value}
              onValueChange={field.onChange}
              label="Cuisine"
              description="Select the cuisine type for this recipe"
            />
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Recipe'}
          </Button>
        </div>
      </form>
    </Form>
  );
}