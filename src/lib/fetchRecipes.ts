import { Recipe, RecipeWithPagination } from "@/lib/types";

const BASE_URL = "https://dummyjson.com/recipes";

async function fetchAPI(endpoint: string) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch API Error:", error);
    throw error;
  }
}

export async function getAllRecipes(
  limit: number = 30,
  skip: number = 0
): Promise<Recipe[]> {
  const endpoint = `?limit=${limit}&skip=${skip}`;
  const data = await fetchAPI(endpoint);
  return data.recipes;
}

export async function getRecipeById(id: number): Promise<Recipe> {
  const endpoint = `/${id}`;
  return fetchAPI(endpoint);
}

export async function searchRecipes(query: string): Promise<Recipe[]> {
  const endpoint = `/search?q=${encodeURIComponent(query)}`;
  const data = await fetchAPI(endpoint);
  return data.recipes;
}

export async function getRecipesWithPagination(
  select?: string[],
  limit: number = 10,
  skip: number = 0
): Promise<RecipeWithPagination> {
  const selectQuery = select
    ? `&select=${encodeURIComponent(select.join(","))}`
    : "";
  const endpoint = `?limit=${limit}&skip=${skip}${selectQuery}`;
  return fetchAPI(endpoint);
}

export async function sortRecipes(
  sortBy: string,
  order: "asc" | "desc" = "asc"
): Promise<Recipe[]> {
  const endpoint = `?sortBy=${encodeURIComponent(
    sortBy
  )}&order=${encodeURIComponent(order)}`;
  const data = await fetchAPI(endpoint);
  return data.recipes;
}

export async function getAllRecipeTags(): Promise<string[]> {
  const endpoint = `/tags`;
  return fetchAPI(endpoint);
}

export async function getRecipesByTag(tag: string): Promise<Recipe[]> {
  const endpoint = `/tag/${encodeURIComponent(tag)}`;
  const data = await fetchAPI(endpoint);
  return data.recipes;
}

export async function getRecipesByMeal(mealType: string): Promise<Recipe[]> {
  const endpoint = `/meal-type/${encodeURIComponent(mealType)}`;
  const data = await fetchAPI(endpoint);
  return data.recipes;
}
