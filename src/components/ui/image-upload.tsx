'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import { Input } from './input';
import { FormControl, FormItem, FormLabel, FormMessage } from './form';
import { ImageIcon, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/useToast';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  bucketName?: string;
}

export function ImageUpload({ value, onChange, label = 'Image', bucketName = 'profiles' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  // Reset preview when value changes externally
  useEffect(() => {
    setPreview(value ?? null);
  }, [value]);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file.',
        variant: 'destructive',
      });
      return;
    }

    // Create preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucketName);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      // Call onChange with the new image URL if upload was successful
      if (result.url) {
        onChange(result.url);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive',
      });

      // Revert preview on error
      setPreview(value ?? null);
    } finally {
      setIsUploading(false);
    }
  };

  const imageUrl = preview || value;

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className="space-y-4 sm:space-y-0 sm:flex sm:items-start sm:gap-4">
        <div className="relative w-full sm:w-[200px] aspect-video sm:aspect-square rounded-lg overflow-hidden bg-muted">
          {imageUrl ? (
            <Image src={imageUrl} alt="Preview" fill className="object-cover transition-opacity duration-300" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-white" />
            </div>
          )}
        </div>

        <div className="space-y-2 flex-1">
          <FormControl>
            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full cursor-pointer file:cursor-pointer"
                disabled={isUploading}
              />
              {isUploading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4" />
                </div>
              )}
            </div>
          </FormControl>
          <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, GIF. Max file size: 5MB</p>
        </div>
      </div>
      <FormMessage />
    </FormItem>
  );
}
