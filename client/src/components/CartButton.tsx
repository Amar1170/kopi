import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Cart } from "./Cart";

const CartButton = () => {
  const { cartItems } = useCart();
  
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button 
          className="fixed bottom-20 right-4 z-40 w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300 hover:bg-primary/90" 
          aria-label="Open shopping cart"
        >
          <ShoppingCart className="h-6 w-6" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent w-6 h-6 rounded-full text-xs flex items-center justify-center font-medium text-accent-foreground">
              {itemCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <Cart />
    </Sheet>
  );
};

export default CartButton;
