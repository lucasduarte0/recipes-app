"use client";

import { CategoriesGrid } from "@/components/CategoriesGrid";
import RecipesCards from "@/components/recipe-card/RecipesCards";
import Search from "@/components/Search";
import { Button } from "@/components/ui/button";

import { Clock, ChefHat, Flame } from "lucide-react";
import { useState } from "react";

const filters = [
  { icon: Clock, label: "Quick (< 30 min)" },
  { icon: ChefHat, label: "Easy" },
  { icon: Flame, label: "Popular" },
];

interface SearchPageClientProps {
  categoryList: string[];
}

export default function SearchPageClient({
  categoryList,
}: SearchPageClientProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const toggleFilter = (filter: string) => {
    setActiveFilters((current) =>
      current.includes(filter)
        ? current.filter((f) => f !== filter)
        : [...current, filter]
    );
  };
  return (
    <div className="container mx-auto px-8 py-6 space-y-6">
      {/* Search Input */}
      <Search value={searchQuery} onChange={setSearchQuery} />

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {filters.map(({ icon: Icon, label }) => (
          <Button
            key={label}
            variant={activeFilters.includes(label) ? "default" : "outline"}
            className="gap-2"
            onClick={() => toggleFilter(label)}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        ))}
      </div>

      {/* Categories */}
      {searchQuery.length > 0 ? (
        <RecipesCards searchTerm={searchQuery} />
      ) : (
        <CategoriesGrid categoryList={categoryList} />
      )}
    </div>
  );
}
