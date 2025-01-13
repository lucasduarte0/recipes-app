'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { User, Edit2, Plus } from 'lucide-react';
import { useRef, useState } from 'react';
import { useToast } from '@/hooks/useToast';

interface EditAvatarDialogProps {
  user: {
    imageUrl: string | null;
  };
  updateProfileImage: (formData: FormData) => Promise<void>;
}

export function EditAvatarDialog({ user, updateProfileImage }: EditAvatarDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      await updateProfileImage(formData);
      toast({
        title: 'Success',
        description: 'Profile image updated successfully',
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile image',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="relative">
          <Avatar className="w-24 h-24">
            <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-2xl">
              {user.imageUrl && <AvatarImage src={user.imageUrl} />}
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </div>
          </Avatar>

          <Button
            variant="secondary"
            size="icon"
            className="absolute bottom-0 right-0 rounded-full shadow-md h-6 w-6 p-4"
            onClick={() => setIsOpen(true)}>
            {user.imageUrl ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
          <DialogDescription>Choose a new profile picture to update your avatar.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <Avatar className="w-32 h-32">
            <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-4xl">
              {user.imageUrl && <AvatarImage src={user.imageUrl} />}
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </div>
          </Avatar>

          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

          <Button onClick={() => fileInputRef.current?.click()} className="w-full">
            Choose Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
