import { useQuery } from "@tanstack/react-query";
import { Product, Category } from "@shared/schema";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Coffee } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard";
import CategorySelector from "@/components/CategorySelector";
import LocationMap from "@/components/LocationMap";

const Home = () => {
  const { data: featuredProducts, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", "featured=true"],
  });

  const { data: locations, isLoading: locationsLoading } = useQuery({
    queryKey: ["/api/locations"],
  });

  return (
    <div>
      <section className="mb-8">
        <div className="bg-secondary rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-4 md:mb-0 md:mr-6 flex-1">
              <h1 className="text-3xl md:text-4xl font-serif font-medium mb-2">Welcome to Coffee Haven</h1>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Experience the finest coffee in town. From espresso to pastries, we've got your cravings covered.
              </p>
              <div className="flex space-x-3">
                <Button asChild>
                  <Link href="/menu">Browse Menu</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/locations">Find Us</Link>
                </Button>
              </div>
            </div>
            <div className="w-full md:w-2/5 h-48 md:h-64 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Coffee shop ambiance"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        
        <CategorySelector />
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-serif text-xl font-medium">Featured Items</h2>
            <Link href="/menu" className="text-primary flex items-center text-sm font-medium">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
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
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Coffee className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p>No featured products available at the moment.</p>
            </div>
          )}
        </div>
        
        {locationsLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="w-full h-40 rounded-md mb-4" />
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        ) : locations ? (
          <LocationMap locations={locations} />
        ) : null}
      </section>
    </div>
  );
};

export default Home;
