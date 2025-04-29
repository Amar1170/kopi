import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useState } from "react";
import { Product } from "@shared/schema";
import { Coffee, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard";
import CategorySelector from "@/components/CategorySelector";
import PriceFilter from "@/components/PriceFilter";
import DownloadMenu from "@/components/DownloadMenu";

const Menu = () => {
  const { categoryId } = useParams();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, Infinity]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const queryKey = categoryId 
    ? ["/api/products", `category=${categoryId}`]
    : ["/api/products"];
    
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey,
  });
  
  const handlePriceFilterChange = (min: number, max: number) => {
    setPriceRange([min, max]);
  };
  
  const filteredProducts = products?.filter(product => 
    product.price >= priceRange[0] && 
    (priceRange[1] === Infinity || product.price <= priceRange[1])
  );

  return (
    <div>
      <CategorySelector selectedCategoryId={categoryId} />
      
      <PriceFilter onFilterChange={handlePriceFilterChange} />
      
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-serif text-xl font-medium">Our Menu</h2>
          <div className="flex items-center">
            <div className="flex items-center space-x-2 mr-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                className="h-9 w-9"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
                <span className="sr-only">List view</span>
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                className="h-9 w-9"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
                <span className="sr-only">Grid view</span>
              </Button>
            </div>
            <DownloadMenu />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
                <Skeleton className="w-full h-40" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts && filteredProducts.length > 0 ? (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-4"
          }>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Coffee className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-xl font-medium mb-1">No products found</p>
            <p className="text-muted-foreground">
              Try adjusting your filters or selecting a different category.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Menu;
