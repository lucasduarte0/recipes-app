import { useMutation } from '@tanstack/react-query';
import { toggleLike } from '@/services/likes';
import { toast } from '@/hooks/useToast';

export function useLikeRecipe(userId?: string) {
  const { mutate: handleToggleLike } = useMutation({
    mutationFn: async (recipeId: number) => {
      if (!userId) {
        toast({
          title: 'Authentication Required',
          description: 'Please sign in to like recipes',
        });
        throw new Error('Authentication required');
      }
      return toggleLike(recipeId, userId);
    },
    onError: (error) => {
      if (error instanceof Error && error.message === 'Authentication required') {
        return; // Toast already shown in mutationFn
      }
      toast({
        title: 'Error',
        description: 'Failed to save like status',
      });
    },
    // onSuccess: () => {
    //   console.log('Like status updated successfully');
    // },
  });

  return { handleToggleLike };
}
