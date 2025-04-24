import { useState, useCallback, memo, useRef, useEffect } from "react";
import { Order, OrderItem, OrderStatus, UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Clock, 
  CheckCircle2, 
  CircleDashed, 
  ChefHat, 
  BellRing, 
  Coffee,
  Receipt,
  X,
  Minus,
  Plus,
  Trash,
  Loader2
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { handleCancelOrder } from "@/contexts/orderHelpers";
import { isOrderProcessing } from "@/contexts/orderOptimizer";
import { preventRapidClicks } from "@/lib/performance";

interface OrderCardProps {
  order: Order;
  userRole: UserRole;
  updateStatus?: (orderId: string, status: OrderStatus) => void;
  onGenerateBill?: (order: Order) => Promise<void>;
}

const OrderCard = memo(({ order, userRole, updateStatus, onGenerateBill }: OrderCardProps) => {
  const { orders, setOrders } = useApp();
  const [showDetails, setShowDetails] = useState(false);
  const [isLocalProcessing, setIsLocalProcessing] = useState(false);
  const processingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const buttonStatesRef = useRef<Record<string, boolean>>({});

  const isProcessing = isLocalProcessing || isOrderProcessing(order.id);

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

  const getNextStatus = useCallback(() => {
    const statusFlow: OrderStatus[] = ["pending", "confirmed", "preparing", "ready", "served", "completed"];
    const currentIndex = statusFlow.indexOf(order.status);
    return statusFlow[currentIndex + 1];
  }, [order.status]);

  const canUpdateStatus = useCallback((role: UserRole, status: OrderStatus, nextStatus: OrderStatus) => {
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
  }, []);

  useEffect(() => {
    setIsLocalProcessing(false);
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
    }
    
    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, [order.status]);

  useEffect(() => {
    if (isLocalProcessing && buttonRef.current) {
      buttonRef.current.disabled = true;
    }
  }, [isLocalProcessing]);

  const updateItemQuantity = useCallback((itemId: string, delta: number) => {
    const clickId = `quantity-${order.id}-${itemId}-${delta > 0 ? 'inc' : 'dec'}`;
    if (!preventRapidClicks(clickId, 500)) return;
    
    if (order.status !== 'pending') {
      toast.error("Can only modify pending orders");
      return;
    }

    setOrders(prev => prev.map(o => {
      if (o.id !== order.id) return o;

      const updatedItems = o.items.map(item => {
        if (item.id !== itemId) return item;
        
        const newQuantity = item.quantity + delta;
        if (newQuantity <= 0) return null;
        
        return { ...item, quantity: newQuantity };
      }).filter(Boolean) as OrderItem[];

      const totalAmount = updatedItems.reduce(
        (sum, item) => sum + (item.menuItem.price * item.quantity), 
        0
      );

      return {
        ...o,
        items: updatedItems,
        totalAmount
      };
    }));

    toast.success("Order updated successfully");
  }, [order.id, order.status, setOrders]);

  const removeItem = useCallback((itemId: string) => {
    const clickId = `remove-${order.id}-${itemId}`;
    if (!preventRapidClicks(clickId, 500)) return;
    
    if (order.status !== 'pending') {
      toast.error("Can only modify pending orders");
      return;
    }

    setOrders(prev => prev.map(o => {
      if (o.id !== order.id) return o;

      const updatedItems = o.items.filter(item => item.id !== itemId);
      
      const totalAmount = updatedItems.reduce(
        (sum, item) => sum + (item.menuItem.price * item.quantity), 
        0
      );

      return {
        ...o,
        items: updatedItems,
        totalAmount
      };
    }));

    toast.success("Item removed from order");
  }, [order.id, order.status, setOrders]);

  const handleStatusUpdate = useCallback(() => {
    if (isProcessing) {
      console.log("Ignoring click - already processing");
      return;
    }
    
    const clickId = `status-${order.id}-${order.status}`;
    if (!preventRapidClicks(clickId, 2000)) {
      console.log("Ignoring rapid click on status update");
      return;
    }
    
    if (buttonStatesRef.current[clickId]) {
      console.log("Button already clicked, ignoring");
      return;
    }
    
    buttonStatesRef.current[clickId] = true;
    
    const nextStatus = getNextStatus();
    if (!nextStatus || !updateStatus) {
      buttonStatesRef.current[clickId] = false;
      return;
    }
    
    if (canUpdateStatus(userRole, order.status, nextStatus)) {
      setIsLocalProcessing(true);
      
      const toastId = `updating-${order.id}-${Date.now()}`;
      toast.loading(`Updating order to ${nextStatus}...`, {
        id: toastId,
        duration: 2000
      });
      
      setTimeout(() => {
        if (updateStatus) {
          updateStatus(order.id, nextStatus);
        }
      }, 10);
      
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
      
      processingTimeoutRef.current = setTimeout(() => {
        setIsLocalProcessing(false);
        buttonStatesRef.current[clickId] = false;
      }, 5000);
    }
  }, [isProcessing, getNextStatus, canUpdateStatus, userRole, order.status, order.id, updateStatus]);

  const renderStatusButton = useCallback(() => {
    const nextStatus = getNextStatus();
    if (!nextStatus || !updateStatus) return null;

    if (canUpdateStatus(userRole, order.status, nextStatus)) {
      return (
        <Button 
          ref={buttonRef}
          onClick={handleStatusUpdate}
          className={`bg-pink-700 hover:bg-pink-800 text-white ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            `Mark as ${nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}`
          )}
        </Button>
      );
    }
    return null;
  }, [userRole, order.id, order.status, getNextStatus, canUpdateStatus, updateStatus, handleStatusUpdate, isProcessing]);

  const totalAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(order.totalAmount);

  const handleCancel = useCallback(() => {
    const clickId = `cancel-${order.id}`;
    if (!preventRapidClicks(clickId, 1000)) return;
    
    if (window.confirm('Are you sure you want to cancel this order?')) {
      handleCancelOrder(order.id, setOrders);
    }
  }, [order.id, setOrders]);

  const toggleDetails = useCallback(() => {
    setShowDetails(prev => !prev);
  }, []);

  useEffect(() => {
    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, []);

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
            onClick={toggleDetails}
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
                <div className="flex items-center gap-2">
                  {userRole === 'waiter' && order.status === 'pending' && (
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => updateItemQuantity(item.id, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => updateItemQuantity(item.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7 text-red-500 hover:text-red-600"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <p className="font-medium ml-4">
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
              disabled={isProcessing}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel Order
            </Button>
          )}
          
          {userRole === "admin" && onGenerateBill && (
            <Button 
              variant="outline" 
              className="ml-auto border-pink-200 text-pink-700"
              onClick={() => onGenerateBill(order)}
            >
              <Receipt className="h-4 w-4 mr-2" />
              Generate Bill
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
});

OrderCard.displayName = "OrderCard";

export default OrderCard;
