import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function supabaseLoader({
  url,
  width,
  quality,
}: {
  url: string;
  width: number;
  quality?: number;
}) {
  return `${url}?width=${width}&quality=${quality || 75}`;
}

// Helper to parse number
export const parseNumber = (value: string | undefined): number | undefined => {
  if (!value) return undefined;
  const num = Number(value);
  return isNaN(num) ? undefined : num;
};

// Helper to parse array
export const parseArray = (
  value: string | string[] | undefined
): string[] | undefined => {
  if (!value) return undefined;
  const arr = Array.isArray(value) ? value : value.split(',');
  return arr.filter(Boolean).map((item) => item.trim());
};
