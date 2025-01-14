import { isUsernameAvailable } from '@/services/users';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function supabaseLoader({ url, width, quality }: { url: string; width: number; quality?: number }) {
  return `${url}?width=${width}&quality=${quality || 75}`;
}

// Helper to parse number
export const parseNumber = (value: string | undefined): number | undefined => {
  if (!value) return undefined;
  const num = Number(value);
  return isNaN(num) ? undefined : num;
};

// Helper to parse array
export const parseArray = (value: string | string[] | undefined): string[] | undefined => {
  if (!value) return undefined;
  const arr = Array.isArray(value) ? value : value.split(',');
  return arr.filter(Boolean).map((item) => item.trim());
};

/**
 * Generates a random username from an email address
 * Removes special characters, adds random numbers if needed
 * @param email The email address to generate username from
 * @returns A random username
 */
export function generateUsernameFromEmail(email: string): string {
  // Get the part before @ symbol
  const localPart = email.split('@')[0];

  // Remove special characters and dots
  const cleaned = localPart.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

  // Generate a random number between 1000-9999
  const randomNum = Math.floor(Math.random() * 9000) + 1000;

  // Return combination of cleaned email and random number
  return `${cleaned}${randomNum}`;
}

/**
 * Generates a unique username from email by checking database
 * Retries with different random numbers if username exists
 */
export async function generateUniqueUsername(email: string, maxAttempts = 5): Promise<string> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    const username = generateUsernameFromEmail(email);

    // Check if username is available in database
    const { available } = await isUsernameAvailable(username);

    if (available) {
      return username;
    }

    attempts++;
  }

  // If all attempts fail, add timestamp to make it unique
  const timestamp = Date.now().toString().slice(-4);
  const finalUsername = `${email.split('@')[0].toLowerCase()}${timestamp}`;

  return finalUsername;
}
