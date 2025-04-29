import { useQuery } from "@tanstack/react-query";
import { Order } from "@shared/schema";
import { formatCurrency, formatDate } from "@/lib/utils";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Coffee, Package } from "lucide-react";
import { Fragment } from "react";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-500";
    case "pending":
      return "bg-yellow-500";
    case "processing":
      return "bg-blue-500";
    case "cancelled":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const OrderHistory = () => {
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-medium mb-2">Order History</h1>
        <p className="text-muted-foreground">
          View your past orders and check their status.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-4 w-48 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
                <CardDescription>
                  {order.created_at ? formatDate(order.created_at) : "Date unavailable"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="order-details">
                    <AccordionTrigger className="py-2">
                      Order Details
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div className="flex justify-between py-1 border-b">
                          <span className="font-medium">Customer</span>
                          <span>{order.customer_name}</span>
                        </div>
                        {order.customer_phone && (
                          <div className="flex justify-between py-1 border-b">
                            <span className="font-medium">Phone</span>
                            <span>{order.customer_phone}</span>
                          </div>
                        )}
                        {order.customer_email && (
                          <div className="flex justify-between py-1 border-b">
                            <span className="font-medium">Email</span>
                            <span>{order.customer_email}</span>
                          </div>
                        )}
                        {order.pickup_location_id && (
                          <div className="flex justify-between py-1 border-b">
                            <span className="font-medium">Pickup Location</span>
                            <span>Store #{order.pickup_location_id}</span>
                          </div>
                        )}
                        {order.pickup_time && (
                          <div className="flex justify-between py-1 border-b">
                            <span className="font-medium">Pickup Time</span>
                            <span>{formatDate(order.pickup_time)}</span>
                          </div>
                        )}
                        <div className="flex justify-between py-1 border-b">
                          <span className="font-medium">Total</span>
                          <span className="font-medium text-primary">
                            {formatCurrency(order.total)}
                          </span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-xl font-medium mb-1">No orders yet</p>
          <p className="text-muted-foreground">
            When you place an order, it will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
