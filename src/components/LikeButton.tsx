'use client';
import React, { useState, useCallback } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLikeRecipe } from '@/hooks/useLikeRecipe';
import { useAuth } from '@clerk/nextjs';

interface HeartButtonProps {
  isLiked?: boolean;
  likeCount: number;
  recipeId: number;
  size?: number;
}

export const LikeButton = React.memo(function LikeButton({
  isLiked: initialIsLiked = false,
  likeCount: initialLikeCount,
  recipeId,
  size = 22,
}: HeartButtonProps) {
  const { userId } = useAuth();
  const { handleToggleLike } = useLikeRecipe(userId || undefined);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();

      // Update UI immediately
      setIsLiked((current) => !current);
      setLikeCount((current) => current + (isLiked ? -1 : 1));

      // Track in background
      handleToggleLike(recipeId);
    },
    [handleToggleLike, isLiked, recipeId]
  );

  return (
    <div className="flex items-center gap-1 px-2">
      <span className="text-xs px-0.5 text-muted-foreground">{likeCount}</span>
      <button type="button" onClick={handleClick} className="relative z-[5] cursor-pointer transition hover:opacity-80">
        <Heart
          size={size}
          className={cn(isLiked ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-muted-foreground')}
        />
      </button>
    </div>
  );
});
