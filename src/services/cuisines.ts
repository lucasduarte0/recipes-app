import { cache } from 'react';
import prisma from '@/lib/db';

export const getCuisines = cache(async () => {
  const cuisines = await prisma.cuisine.findMany();
  return cuisines;
});
