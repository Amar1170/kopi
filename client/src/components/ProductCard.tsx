import { Product } from "@shared/schema";
import { formatCurrency, truncateText } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Coffee } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      product_id: product.id,
      quantity: 1,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url || "",
      },
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const renderPriceIndicator = () => {
    const priceLevel = Math.min(3, Math.ceil(product.price / 3));
    const dollars = Array(3).fill(0).map((_, i) => (
      <span key={i} className={i < priceLevel ? "" : "opacity-30"}>$</span>
    ));
    
    return <div className="price-indicator">{dollars}</div>;
  };

  return (
    <Link href={`/product/${product.id}`}>
      <a className="product-card bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm block">
        <div className="relative">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-40 object-cover"
            />
          ) : (
            <div className="w-full h-40 bg-muted flex items-center justify-center">
              <Coffee className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
          {product.featured && (
            <div className="absolute top-2 right-2 bg-accent bg-opacity-90 px-2 py-1 rounded-full text-xs font-medium text-accent-foreground">
              Featured
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-accent bg-opacity-90 px-2 py-1 rounded-full text-xs font-bold">
            {renderPriceIndicator()}
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-lg">{product.name}</h3>
            <span className="bg-primary bg-opacity-10 text-primary text-xs px-2 py-1 rounded">
              {formatCurrency(product.price)}
            </span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            {truncateText(product.description || "", 80)}
          </p>
          
          <Button 
            onClick={handleAddToCart}
            className="w-full"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </a>
    </Link>
  );
};

export default ProductCard;
