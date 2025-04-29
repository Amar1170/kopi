import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface CategorySelectorProps {
  selectedCategoryId?: string;
}

const CategorySelector = ({ selectedCategoryId }: CategorySelectorProps) => {
  const [location, setLocation] = useLocation();
  
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const handleCategoryClick = (categoryId: number) => {
    setLocation(`/menu/${categoryId}`);
  };

  if (isLoading) {
    return (
      <div className="mb-6 pt-2">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32" />
        </div>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-28 rounded-full" />
            <Skeleton className="h-10 w-20 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="mb-6 pt-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-lg font-medium">Categories</h2>
        <Link href="/menu" className="text-primary text-sm font-medium">
          View All
        </Link>
      </div>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2">
          <button
            onClick={() => setLocation("/menu")}
            className={cn(
              "flex-shrink-0 px-4 py-2 rounded-full",
              !selectedCategoryId
                ? "bg-primary text-white"
                : "bg-white dark:bg-gray-800 border border-secondary text-primary"
            )}
          >
            <span>All Items</span>
          </button>
          
          {categories?.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-full",
                selectedCategoryId === category.id.toString()
                  ? "bg-primary text-white"
                  : "bg-white dark:bg-gray-800 border border-secondary text-primary"
              )}
            >
              <span>{category.name}</span>
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default CategorySelector;
