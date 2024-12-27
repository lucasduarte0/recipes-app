"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NumericSelectorProps {
  min?: number;
  max?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
}

export default function NumericSelector({
  min = 0,
  max = 99,
  defaultValue = 1,
  onChange,
}: NumericSelectorProps) {
  const [value, setValue] = React.useState(defaultValue);

  const handleDecrease = () => {
    const newValue = Math.max(min, value - 1);
    setValue(newValue);
    onChange?.(newValue);
  };

  const handleIncrease = () => {
    const newValue = Math.min(max, value + 1);
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="inline-flex items-center rounded-full bg-secondary p-1.5">
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full rounded-r-none"
        onClick={handleDecrease}
        disabled={value <= min}
      >
        <Minus className="h-4 w-4" strokeWidth={2.5} />
        <span className="sr-only">Decrease value</span>
      </Button>
      <div className="flex  h-9 w-9 items-center justify-center font-semibold">
        {value}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full rounded-l-none"
        onClick={handleIncrease}
        disabled={value >= max}
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} />
        <span className="sr-only">Increase value</span>
      </Button>
    </div>
  );
}
