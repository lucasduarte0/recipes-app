'use server';

import { createClerkSupabaseServer } from '@/lib/supabase/server';

export async function uploadRecipeImage(file: File, fileName: string) {
  const supabase = await createClerkSupabaseServer();
  const { data, error } = await supabase.storage
    .from('recipes')
    .upload(`${fileName}.png`, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }
  return data;
}