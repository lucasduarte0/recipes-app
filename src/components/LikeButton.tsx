'use client';
import React from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLikeRecipe } from '@/hooks/useLikeRecipe';

interface HeartButtonProps {
  recipeId: number;
  userId: string;
}

export const LikeButton: React.FC<HeartButtonProps> = ({
  recipeId,
  userId,
}) => {
  const { isLiked, likeCount, toggleLike } = useLikeRecipe(recipeId, userId);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    toggleLike();
  };

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-muted-foreground">{likeCount}</span>
      <button
        type="button"
        onClick={handleClick}
        className="relative z-[5] cursor-pointer transition hover:opacity-80">
        <Heart
          size={20}
          className={cn(
            isLiked
              ? 'fill-red-500 stroke-red-500'
              : 'fill-none stroke-muted-foreground'
          )}
        />
      </button>
    </div>
  );
};