'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="absolute z-10 top-4 left-4 p-2 bg-white/70 hover:bg-white/90 rounded-full transition-colors">
      <ChevronLeft className="h-6 w-6" />
    </button>
  );
}
