'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/useToast';
import { getLikeStatus, toggleLike } from '@/services/likes';


type LikeStatus = {
  isLiked: boolean;
  likeCount: number;
};

type MutationContext = {
  previousData: LikeStatus | undefined;
};

export function useLikeRecipe(recipeId: number, userId: string | null) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchLikeStatus = async (): Promise<LikeStatus> => {
    return getLikeStatus(recipeId, userId);
  };

  const { data, isLoading } = useQuery<LikeStatus>({
    queryKey: ['recipeLike', recipeId, userId],
    queryFn: fetchLikeStatus,
    enabled: !!recipeId,
  });

  const mutation = useMutation<boolean, Error, void, MutationContext>({
    mutationFn: async () => {
      if (!userId) {
        throw new Error('Authentication required');
      }
      console.log('Toggling like status for recipeId:', recipeId, 'userId:', userId);
      return toggleLike(recipeId, userId);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ['recipeLike', recipeId, userId],
      });
      const previousData = queryClient.getQueryData<LikeStatus>([
        'recipeLike',
        recipeId,
        userId,
      ]);

      queryClient.setQueryData<LikeStatus>(
        ['recipeLike', recipeId, userId],
        (old) => ({
          isLiked: !old?.isLiked,
          likeCount: (old?.likeCount ?? 0) + (old?.isLiked ? -1 : 1),
        })
      );

      return { previousData };
    },
    onError: (error, _, context) => {
      if (context) {
        queryClient.setQueryData(
          ['recipeLike', recipeId, userId],
          context.previousData
        );
      }
      toast({
        title: 'Error',
        description:
          error.message === 'Authentication required'
            ? 'Please sign in to like recipes'
            : 'Failed to update like status',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['recipeLike', recipeId, userId],
      });
    },
  });

  return {
    isLiked: data?.isLiked ?? false,
    likeCount: data?.likeCount ?? 0,
    isLoading,
    toggleLike: () => mutation.mutate(),
  };
}
