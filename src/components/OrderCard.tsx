import { Order, OrderItem, OrderStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UserRole } from "@/types";
import { 
  Clock, 
  CheckCircle2, 
  CircleDashed, 
  ChefHat, 
  BellRing, 
  Coffee,
  Receipt,
  X
} from "lucide-react";
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";

interface OrderCardProps {
  order: Order;
  userRole: UserRole;
  updateStatus?: (orderId: string, status: OrderStatus) => void;
}

const OrderCard = ({ order, userRole, updateStatus }: OrderCardProps) => {
  const { orders, setOrders } = useApp();
  const [showDetails, setShowDetails] = useState(false);

  const statusIcons = {
    pending: <CircleDashed className="h-5 w-5 mr-2" />,
    confirmed: <Clock className="h-5 w-5 mr-2" />,
    preparing: <ChefHat className="h-5 w-5 mr-2" />,
    ready: <BellRing className="h-5 w-5 mr-2" />,
    served: <Coffee className="h-5 w-5 mr-2" />,
    completed: <CheckCircle2 className="h-5 w-5 mr-2" />,
  };

  const statusClasses = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    confirmed: "bg-blue-100 text-blue-800 border-blue-300",
    preparing: "bg-orange-100 text-orange-800 border-orange-300",
    ready: "bg-green-100 text-green-800 border-green-300",
    served: "bg-purple-100 text-purple-800 border-purple-300",
    completed: "bg-gray-100 text-gray-800 border-gray-300",
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      dateStyle: 'short', 
      timeStyle: 'short' 
    }).format(date);
  };

  const getNextStatus = () => {
    const statusFlow: OrderStatus[] = ["pending", "confirmed", "preparing", "ready", "served", "completed"];
    const currentIndex = statusFlow.indexOf(order.status);
    return statusFlow[currentIndex + 1];
  };

  const canUpdateStatus = (role: UserRole, status: OrderStatus, nextStatus: OrderStatus) => {
    if (role === "admin") return true;

    switch (role) {
      case "waiter":
        return (status === "pending" && nextStatus === "confirmed") || 
               (status === "ready" && nextStatus === "served");
      case "chef":
        return (status === "confirmed" && nextStatus === "preparing") || 
               (status === "preparing" && nextStatus === "ready");
      default:
        return false;
    }
  };

  const renderStatusButton = () => {
    const nextStatus = getNextStatus();
    if (!nextStatus || !updateStatus) return null;

    if (canUpdateStatus(userRole, order.status, nextStatus)) {
      return (
        <Button 
          onClick={() => updateStatus(order.id, nextStatus)}
          className="bg-pink-700 hover:bg-pink-800 text-white"
        >
          Mark as {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
        </Button>
      );
    }
    return null;
  };

  const totalAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(order.totalAmount);

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      setOrders(prev => prev.filter(o => o.id !== order.id));
      toast.success('Order cancelled successfully');
    }
  };

  return (
    <Card className="w-full border-pink-100">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium">Order #{order.id.substring(0, 8)}</CardTitle>
            <CardDescription>
              <span className="font-medium">{order.customerName}</span> - Table #{order.tableNumber}
            </CardDescription>
          </div>
          <Badge className={statusClasses[order.status]}>
            {statusIcons[order.status]}
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Ordered: {formatDate(order.createdAt)}</span>
          <span className="font-medium text-pink-800">{totalAmount}</span>
        </div>

        <div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="text-pink-700 p-0 h-auto"
          >
            {showDetails ? "Hide details" : "View details"}
          </Button>
        </div>

        {showDetails && (
          <div className="mt-4 space-y-3">
            {order.items.map((item: OrderItem) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.quantity} x {item.menuItem.name}</p>
                  <p className="text-sm text-gray-500">{item.menuItem.description.substring(0, 50)}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      minimumFractionDigits: 0,
                    }).format(item.menuItem.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
            
            <Separator />
            
            <div className="flex justify-between font-medium pt-2">
              <span>Total</span>
              <span>{totalAmount}</span>
            </div>
          </div>
        )}
      </CardContent>

      {(updateStatus || order.status === "completed" || order.canCancel) && (
        <CardFooter className="flex justify-between pt-0">
          {renderStatusButton()}
          
          {order.canCancel && userRole === "customer" && order.status === "pending" && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleCancel}
              className="bg-red-600 hover:bg-red-700"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel Order
            </Button>
          )}
          
          {order.status === "completed" && (
            <Button 
              variant="outline" 
              className="ml-auto border-pink-200 text-pink-700"
              onClick={() => {
                window.print();
              }}
            >
              <Receipt className="h-4 w-4 mr-2" />
              View Bill
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default OrderCard;
