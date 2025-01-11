'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { updateUser, UserWithRecipesAndCounts } from '@/services/users';
import { Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/useToast';

interface EditBioDialogProps {
  user: UserWithRecipesAndCounts;
}

export function EditBioDialog({ user }: EditBioDialogProps) {
  const [bio, setBio] = useState(user.bio || '');
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: updateBio, isPending } = useMutation({
    mutationFn: async (newBio: string) => {
      await updateUser(user.id, { bio: newBio });
    },
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['user', user.id] });
      setIsOpen(false);
      toast({
        title: 'Success',
        description: 'Bio updated successfully!',
      });
    },
    onError: (error) => {
      console.error('Failed to save bio:', error);
      toast({
        title: 'Error',
        description: 'Failed to update bio. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSave = () => {
    updateBio(bio);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-primary w-full">
          <Edit2 className="h-4 w-4" />
          <span className=" ">Add a bio to share your cooking journey</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Bio</DialogTitle>
          <DialogDescription>Make changes to your bio here. Click save when you&apos;re done.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write something about yourself..."
            className="min-h-[100px]"
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
