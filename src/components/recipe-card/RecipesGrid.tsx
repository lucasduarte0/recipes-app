"use client";
import RecipesCards from "@/components/recipe-card/RecipesCards";
import Search from "@/components/Search";
import { useState } from "react";

export function RecipesGrid() {
  "use client";
  const [searchTerm, setSearchTerm] = useState<string>("");
  return (
    <div className="w-full space-y-4">
      <Search value={searchTerm} onChange={setSearchTerm} />
      <RecipesCards searchTerm={searchTerm} />
    </div>
  );
}
