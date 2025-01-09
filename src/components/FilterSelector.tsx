'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LucideX } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import { Button } from './ui/button';

// Type objects for each filter selector
const DIFFICULTY_OPTIONS = [
  { label: 'Easy', value: 'Easy' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Hard', value: 'Hard' },
];

const PREPARATION_TIME_OPTIONS = [
  { label: '15 mins', value: '15' },
  { label: '30 mins', value: '30' },
  { label: '1 hour', value: '60' },
  { label: '2 hours', value: '120' },
];

export function FilterSelector() {
  const [difficulty, setDifficulty] = useQueryState('difficulty', parseAsString);
  const [prepTime, setPrepTime] = useQueryState('prepTime', parseAsString);

  const handleClearFilters = () => {
    setDifficulty(null, { shallow: false });
    setPrepTime(null, { shallow: false });
  };

  const handleDifficultyChange = (value: string) => {
    setDifficulty(value, { shallow: false });
  };

  const handlePrepTimeChange = (value: string) => {
    setPrepTime(value, { shallow: false });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center w-full gap-4">
      <div className="grid grid-cols-1 sm:flex sm:flex-row items-center w-full gap-4">
        <div className="grid grid-cols-3 sm:flex sm:flex-row items-center w-full gap-4">
          <Select value={difficulty || ''} onValueChange={handleDifficultyChange}>
            <SelectTrigger className="w-full rounded-full ring-2 ring-offset-2 ring-gray-300 border-none px-4 py-1 h-7">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              {DIFFICULTY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={prepTime || ''} onValueChange={handlePrepTimeChange}>
            <SelectTrigger className="w-full rounded-full ring-2 ring-offset-2 ring-gray-300 border-none px-4 py-1 h-7">
              <SelectValue placeholder="Prep Time" />
            </SelectTrigger>
            <SelectContent>
              {PREPARATION_TIME_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* <Select value={preparationTime || ''} onValueChange={setPreparationTime}>
            <SelectTrigger className="w-full rounded-full ring-2 ring-offset-2 ring-gray-300 border-none px-4 py-1 h-7">
              <SelectValue placeholder="Prep Time" />
            </SelectTrigger>
            <SelectContent>
              {PREPARATION_TIME_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}
          {(difficulty || prepTime) && (
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-transparent p-0 ring-2 ring-offset-2 ring-gray-300 rounded-full h-full"
              onClick={handleClearFilters}>
              <LucideX className="h-4 w-4  text-gray-400 hover:text-gray-600 transition-colors duration-200" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
