'use client';

import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { X } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';
import { Input } from './input';
import { Button } from './button';

interface ListFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  showNumbers?: boolean;
}

export function ListField({
  form,
  name,
  label,
  placeholder = 'Add item',
  showNumbers = false,
}: ListFieldProps) {
  const [newItem, setNewItem] = useState('');

  const handleAddItem = () => {
    if (newItem.trim()) {
      const currentItems = form.getValues(name);
      form.setValue(name, [...currentItems, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemoveItem = (index: number) => {
    const currentItems = form.getValues(name);
    form.setValue(
      name,
      currentItems.filter((_: string, i: number) => i !== index)
    );
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder={placeholder}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddItem();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddItem}>
                  Add
                </Button>
              </div>
              <ul className="space-y-2">
                {form.getValues(name).map((item: string, index: number) => (
                  <li
                    key={index}
                    className="flex items-center justify-between gap-2 rounded-md border bg-background px-3 py-2 text-sm">
                    <span className="flex-1">
                      {showNumbers ? `${index + 1}. ${item}` : item}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full p-0 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleRemoveItem(index)}
                      aria-label="Remove item">
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
