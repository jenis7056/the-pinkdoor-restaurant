
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { Order, OrderStatus } from "@/types";
import OrderCard from "@/components/OrderCard";

interface RecentOrdersProps {
  activeOrders: Order[];
  onViewAllClick: () => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const RecentOrders = ({ activeOrders, onViewAllClick, updateOrderStatus }: RecentOrdersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-playfair">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {activeOrders.length > 0 ? (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {activeOrders.slice(0, 3).map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                userRole="admin"
                updateStatus={updateOrderStatus}
              />
            ))}
            
            {activeOrders.length > 3 && (
              <div className="text-center pt-4">
                <Button 
                  variant="link"
                  className="text-pink-700" 
                  onClick={onViewAllClick}
                >
                  View All Orders
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>No active orders at the moment</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
