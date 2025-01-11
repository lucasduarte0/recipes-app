'use server';

import { createClerkSupabaseServer } from '@/lib/supabase/server';

export async function uploadRecipeImage(file: File, fileName: string) {
  const supabase = await createClerkSupabaseServer();
  const { data, error } = await supabase.storage.from('recipes').upload(`${fileName}.png`, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }
  return data;
}

export async function uploadProfileImage(file: File, userId: string) {
  const supabase = await createClerkSupabaseServer();

  const { data, error } = await supabase.storage.from('profiles').upload(`${userId}.png`, file, {
    cacheControl: '3600',
    upsert: true,
  });

  if (error) {
    throw new Error(`Failed to upload profile image: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('profiles').getPublicUrl(`${userId}.png`);

  return publicUrl;
}

export async function checkSession() {
  const supabase = await createClerkSupabaseServer();

  const authSession = await supabase.auth.getSession();
  console.log(authSession); // Add this line to log the auth session
}
