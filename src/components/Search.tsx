import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search recipes"
          className=" bg-gray-100 rounded-xl border-none pl-10 pr-4 py-6"
        />
      </div>
    </div>
  );
}
