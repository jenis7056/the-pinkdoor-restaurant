
import { Customer, OrderItem, Order, OrderStatus } from "@/types";
import { toast } from "sonner";
import { optimizeBatchOrderUpdate, throttle, debounce } from "./orderOptimizer";

export const handleCreateOrder = (
  items: OrderItem[],
  currentCustomer: Customer | null,
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>,
  setCart: React.Dispatch<React.SetStateAction<OrderItem[]>>
) => {
  if (!currentCustomer) {
    toast.error('No customer is logged in');
    return;
  }
  
  const totalAmount = items.reduce(
    (sum, item) => sum + (item.menuItem.price * item.quantity), 
    0
  );
  
  const newOrder: Order = {
    id: crypto.randomUUID(),
    customerId: currentCustomer.id,
    customerName: currentCustomer.name,
    tableNumber: currentCustomer.tableNumber!,
    items,
    status: 'pending',
    totalAmount,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    canCancel: true,
  };
  
  console.log("Creating new order:", newOrder);
  // Use functional update to avoid stale state
  setOrders(prev => [...prev, newOrder]);
  setCart([]); // Clear the cart after ordering
  toast.success('Your order has been placed successfully!');
  
  // Set a timeout to remove cancel ability after 2 minutes
  setTimeout(() => {
    setOrders(prev => 
      prev.map(order => 
        order.id === newOrder.id 
          ? { ...order, canCancel: false }
          : order
      )
    );
  }, 120000); // 2 minutes
  
  return newOrder;
};

export const handleCancelOrder = (
  orderId: string,
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>
) => {
  // Use optimized approach to filter - more efficient than map+filter
  setOrders(prev => prev.filter(order => order.id !== orderId));
  toast.success('Order cancelled successfully');
};

// Increase throttle time to prevent rapid consecutive updates
export const handleUpdateOrderStatus = throttle((
  orderId: string, 
  status: OrderStatus,
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>,
  setCurrentCustomer?: React.Dispatch<React.SetStateAction<Customer | null>>
) => {
  console.log("Updating order status:", orderId, status);
  
  // Optimize state updates by using our optimized batch update
  setOrders(prev => optimizeBatchOrderUpdate(prev, orderId, status));
  
  // Small delay to prevent UI jank during toast display
  setTimeout(() => {
    const statusMessages = {
      'confirmed': 'Order confirmed by waiter',
      'preparing': 'Chef has started preparing your order',
      'ready': 'Your order is ready to be served',
      'served': 'Your order has been served',
      'completed': 'Order completed',
    };
    
    toast.success(statusMessages[status] || `Order status updated to ${status}`);
  }, 50);
  
  // Debounce the auto-completion of orders to reduce unnecessary re-renders
  if (status === 'served') {
    const completeOrderAfterServed = debounce((id: string) => {
      setOrders(prev => {
        // First check if the order still exists and is still in served status
        const orderIndex = prev.findIndex(order => order.id === id && order.status === 'served');
        if (orderIndex === -1) return prev;
        
        // Use optimized batch update
        return optimizeBatchOrderUpdate(prev, id, 'completed');
      });
      
      toast.success('Your order has been completed');
    }, 300);
    
    // Auto-complete orders after they've been served for a while (60 seconds)
    setTimeout(() => {
      completeOrderAfterServed(orderId);
    }, 60000); // 60 seconds
  }
  
  // Only logout customer when admin manually completes the order from admin panel
  // Do NOT auto-logout when a customer confirms their own order
  if (status === 'completed' && setCurrentCustomer) {
    // Check if this is an admin/staff action or a customer action
    const isCustomerAction = document.location.pathname.includes('/customer');
    
    // Only trigger the auto-logout if this is NOT a customer action
    if (!isCustomerAction) {
      // Add a small delay before logout to prevent UI issues
      const logoutCustomer = debounce(() => {
        setCurrentCustomer(null);
        toast.success('Thank you for dining with us!');
      }, 200);
      
      setTimeout(logoutCustomer, 1500);
    }
  }
}, 500); // Increased from 300ms to 500ms for better performance
