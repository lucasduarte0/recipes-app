'use client';

import { Input } from '@/components/ui/input';
import { LucideX, SearchIcon } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import { useDebouncedCallback } from 'use-debounce';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

export function SearchBar() {
  const [search, setSearch] = useQueryState('search', parseAsString);
  const [inputValue, setInputValue] = useState('');

  // Only set the input value from URL when component mounts
  useEffect(() => {
    setInputValue(search ?? '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = useDebouncedCallback((value: string) => {
    if (!value) {
      setSearch(null, {
        shallow: false,
      });
      return;
    }
    setSearch(value, {
      shallow: false,
    });
  }, 500);

  const handleClear = () => {
    setInputValue('');
    setSearch(null, {
      shallow: false,
    });
  };

  return (
    <>
      <div className="flex items-center justify-center w-full">
        <div className="relative w-full">
          <Input
            key="search"
            type="text"
            placeholder="Search recipes"
            className="peer w-full rounded-full ring-2 ring-offset-2 ring-gray-300 border-none pl-12 pr-12 py-4 placeholder:text-gray-400"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              handleChange(e.target.value);
            }}
          />
          <SearchIcon
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-primary transition-colors duration-200 pointer-events-none"
          />
          {inputValue && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent "
              onClick={handleClear}>
              <LucideX size={32} className="text-gray-400 hover:text-gray-600 transition-colors duration-200" />
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
