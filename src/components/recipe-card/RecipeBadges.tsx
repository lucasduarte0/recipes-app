import { Star, ChefHat, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RecipeBadgesProps {
  rating: string | number;
  difficulty: string;
  prepTimeMinutes: number;
}

export function RecipeBadges({
  rating,
  difficulty,
  prepTimeMinutes,
}: RecipeBadgesProps) {
  return (
    <div className="absolute flex items-center gap-2 px-3 py-2 bg-opacity-90 rounded-md z-10">
      <Badge
        className="bg-white gap-2 py-1.5 border-none opacity-95 rounded-lg"
        variant="outline"
      >
        <Star className="w-4 h-4 text-yellow-500" />
        {rating || "4.8"}
      </Badge>
      <Badge
        className="bg-white gap-2 py-1.5 border-none opacity-95 rounded-lg"
        variant="outline"
      >
        <ChefHat className="w-4 h-4 text-gray-500" />
        {difficulty || "Easy"}
      </Badge>
      <Badge
        className="bg-white gap-2 py-1.5 border-none opacity-95 rounded-lg"
        variant="outline"
      >
        <Timer className="w-4 h-4 text-red-500" />
        <span className="">{`${prepTimeMinutes || 0} min`}</span>
      </Badge>
    </div>
  );
}
