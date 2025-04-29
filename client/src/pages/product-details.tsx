import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { Product, Category } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Coffee, ChevronLeft, Star, ShoppingCart, Info } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const ProductDetails = () => {
  const { productId } = useParams();
  const [location, setLocation] = useLocation();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();
  
  const { data: product, isLoading: productLoading } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
  });
  
  const { data: category, isLoading: categoryLoading } = useQuery<Category>({
    queryKey: [`/api/categories/${product?.category_id}`],
    enabled: !!product?.category_id,
  });
  
  const { data: relatedProducts, isLoading: relatedLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", `category=${product?.category_id}`],
    enabled: !!product?.category_id,
  });
  
  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      product_id: product.id,
      quantity,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url || "",
      },
    });
    
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} has been added to your cart.`,
    });
  };
  
  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };
  
  if (productLoading) {
    return (
      <div>
        <Button variant="ghost" className="mb-6" onClick={() => setLocation("/menu")}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Menu
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="pt-4 space-y-2">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="text-center py-12">
        <Info className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
        <p className="text-xl font-medium mb-1">Product not found</p>
        <p className="text-muted-foreground mb-4">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/menu">
            <Coffee className="mr-2 h-4 w-4" />
            Browse Menu
          </Link>
        </Button>
      </div>
    );
  }
  
  const filteredRelatedProducts = relatedProducts?.filter(p => p.id !== product.id).slice(0, 3) || [];
  
  return (
    <div>
      <Button variant="ghost" className="mb-6" onClick={() => setLocation("/menu")}>
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back to Menu
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-lg overflow-hidden bg-white dark:bg-gray-800">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full aspect-square object-cover"
            />
          ) : (
            <div className="w-full aspect-square bg-muted flex items-center justify-center">
              <Coffee className="h-20 w-20 text-muted-foreground" />
            </div>
          )}
        </div>
        
        <div>
          <div className="mb-2">
            {category && (
              <Link href={`/menu/${category.id}`} className="text-sm text-primary">
                {category.name}
              </Link>
            )}
          </div>
          
          <h1 className="text-3xl font-serif font-medium mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-4 w-4 mr-0.5 text-yellow-500"
                  fill="currentColor"
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground ml-2">(24 Reviews)</span>
          </div>
          
          <p className="text-2xl font-medium text-primary mb-4">
            {formatCurrency(product.price)}
          </p>
          
          <div className="mb-6">
            <p className="text-muted-foreground">{product.description}</p>
          </div>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-r-none"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >-</Button>
              <div className="h-10 w-12 flex items-center justify-center border-y border-input">
                {quantity}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-l-none"
                onClick={() => handleQuantityChange(quantity + 1)}
              >+</Button>
            </div>
            
            <Button className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
          
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-4">
              <Card>
                <CardContent className="pt-4">
                  <p>{product.description || "No description available."}</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="details" className="pt-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between py-1 border-b">
                      <span className="font-medium">Product ID</span>
                      <span>{product.id}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="font-medium">Category</span>
                      <span>{categoryLoading ? "Loading..." : category?.name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="font-medium">Available</span>
                      <span>{product.available ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="font-medium">Featured</span>
                      <span>{product.featured ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {filteredRelatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-serif font-medium mb-4">You might also like</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {relatedLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
                  <Skeleton className="w-full h-40" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              ))
            ) : (
              filteredRelatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="overflow-hidden">
                  <Link href={`/product/${relatedProduct.id}`} className="block">
                      <div className="aspect-video w-full overflow-hidden">
                        {relatedProduct.image_url ? (
                          <img
                            src={relatedProduct.image_url}
                            alt={relatedProduct.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <Coffee className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium">{relatedProduct.name}</h3>
                        <p className="text-primary">{formatCurrency(relatedProduct.price)}</p>
                      </CardContent>
                  </Link>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
