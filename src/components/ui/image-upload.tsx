'use client';

import { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import { Input } from './input';
import { FormControl, FormItem, FormLabel, FormMessage } from './form';
import { uploadRecipeImage } from '@/services/storage';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  label = 'Image',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  // Extract filename from URL
  const currentImageName = value ? value.split('/').pop() : null;

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      console.error('Please upload an image file');
      return;
    }

    try {
      setIsUploading(true);
      const fileName = `${Date.now()}-${file.name}`;
      const data = await uploadRecipeImage(file, fileName);

      if (data?.path) {
        const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/recipes/${data.path}`;
        onChange(imageUrl);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className="space-y-4">
        <div className="flex flex-col items-center space-y-4">
          {value ? (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
              <Image
                src={value}
                alt="Image preview"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">No image selected</span>
            </div>
          )}
          <div className="space-y-2 w-full">
            {currentImageName && (
              <div className="text-sm text-muted-foreground mb-2">
                Current image: {currentImageName}
              </div>
            )}
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
                disabled={isUploading}
              />
            </FormControl>
            {isUploading && (
              <div className="flex items-center justify-center text-sm text-muted-foreground">
                Uploading...
              </div>
            )}
          </div>
        </div>
      </div>
      <FormMessage />
    </FormItem>
  );
}
