import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, AlertCircle, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLocation } from "wouter";

const checkoutSchema = z.object({
  customer_name: z.string().min(2, "Name is required"),
  customer_email: z.string().email("Invalid email address").optional().or(z.literal('')),
  customer_phone: z.string().min(10, "Phone number must be at least 10 digits").optional().or(z.literal('')),
  pickup_location_id: z.number().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const Cart = () => {
  const { cartItems, updateItemQuantity, removeItem, clearCart, calculateTotal } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const { toast } = useToast();
  const [_, navigate] = useLocation();

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      pickup_location_id: 1, // Default to first location
    },
  });

  const handleSubmit = async (data: CheckoutFormData) => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add some items to your cart before checking out",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const orderData = {
        ...data,
        total: calculateTotal(),
        status: "pending",
        items: cartItems.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
      };

      const response = await apiRequest("POST", "/api/orders", orderData);
      const order = await response.json();
      
      clearCart();
      setOrderSuccess(true);
      form.reset();
      
      setTimeout(() => {
        setOrderSuccess(false);
        navigate("/orders");
      }, 3000);
      
    } catch (error) {
      toast({
        title: "Checkout failed",
        description: error instanceof Error ? error.message : "An error occurred during checkout",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SheetContent className="w-full sm:max-w-md">
      <SheetHeader className="mb-4">
        <SheetTitle>Your Order</SheetTitle>
      </SheetHeader>
      
      {orderSuccess ? (
        <div className="flex flex-col items-center justify-center h-full">
          <CheckCircle className="h-16 w-16 text-primary mb-4" />
          <h3 className="text-xl font-medium text-center">Order Placed Successfully!</h3>
          <p className="text-center text-muted-foreground mt-2">
            Thank you for your order. Redirecting to your order history...
          </p>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium">Your cart is empty</h3>
          <p className="text-center text-muted-foreground mt-2">
            Add some delicious items from our menu to get started.
          </p>
          <SheetClose asChild>
            <Button className="mt-6" onClick={() => navigate("/menu")}>
              Browse Menu
            </Button>
          </SheetClose>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.product.id} className="flex items-center py-4 border-b">
                <div className="w-16 h-16 rounded-md overflow-hidden mr-4">
                  {item.product.image_url && (
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.product.name}</h4>
                  <p className="text-muted-foreground text-sm">
                    {formatCurrency(item.product.price)} each
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateItemQuantity(item.product.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateItemQuantity(item.product.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => removeItem(item.product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>
            <div className="flex justify-between font-medium text-lg mb-6">
              <span>Total</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="customer_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="customer_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Your phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="customer_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex space-x-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => clearCart()}
                  >
                    Clear
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Checkout"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}
    </SheetContent>
  );
};
