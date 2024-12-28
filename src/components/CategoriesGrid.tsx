import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

export function CategoriesGrid({ categoryList }: { categoryList: string[] }) {
  const router = useRouter();

  const handleCategoryClick = (category: string) => {
    router.push(`/recipes?category=${category.toLowerCase()}`);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categoryList.map((category: string) => (
        <Card
          key={category}
          className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleCategoryClick(category)}
        >
          <div className="aspect-video relative">
            <Image
              src="https://picsum.photos/200/300"
              alt={category}
              height={200}
              width={200}
              className="object-cover w-full h-full"
            />
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{category}</h3>
                <p className="text-sm text-muted-foreground">
                  {category} recipes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
