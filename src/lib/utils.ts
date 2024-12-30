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
