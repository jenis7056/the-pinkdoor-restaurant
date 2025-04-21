
import { Customer, OrderItem, Order, OrderStatus } from "@/types";
import { toast } from "sonner";
import { optimizeBatchOrderUpdate, throttle, debounce, computeCache } from "./orderOptimizer";

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

// High performance order status update with improved reliability
export const handleUpdateOrderStatus = (
  orderId: string, 
  status: OrderStatus,
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>,
  setCurrentCustomer?: React.Dispatch<React.SetStateAction<Customer | null>>
) => {
  console.log("Updating order status:", orderId, status);
  
  // Check cache first - don't perform the same update multiple times in a short period
  const cacheKey = `order_update_${orderId}_${status}`;
  if (computeCache.get(cacheKey)) {
    console.log("Skipping duplicate update (cached):", orderId, status);
    return;
  }
  computeCache.set(cacheKey, true, 2000); // Cache for 2 seconds to prevent rapid clicks
  
  // Perform the update immediately to improve responsiveness
  setTimeout(() => {
    setOrders(prev => optimizeBatchOrderUpdate(prev, orderId, status));
    
    // Show toast notification without blocking the main thread
    const statusMessages = {
      'confirmed': 'Order confirmed by waiter',
      'preparing': 'Chef has started preparing your order',
      'ready': 'Your order is ready to be served',
      'served': 'Your order has been served',
      'completed': 'Order completed',
    };
    
    toast.success(statusMessages[status] || `Order status updated to ${status}`);
    
    // Handle auto-completion of orders
    if (status === 'served') {
      // Auto-complete orders after they've been served for a while (60 seconds)
      setTimeout(() => {
        setOrders(prev => {
          // First check if the order still exists and is still in served status
          const orderIndex = prev.findIndex(order => order.id === orderId && order.status === 'served');
          if (orderIndex === -1) return prev;
          
          // Use optimized batch update
          console.log(`Auto-completing served order ${orderId}`);
          return optimizeBatchOrderUpdate(prev, orderId, 'completed');
        });
        
        toast.success('Your order has been completed');
      }, 60000); // 60 seconds
    }
    
    // Only logout customer when admin manually completes the order from admin panel
    if (status === 'completed' && setCurrentCustomer) {
      // Check if this is an admin/staff action or a customer action
      const isCustomerAction = document.location.pathname.includes('/customer');
      
      // Only trigger the auto-logout if this is NOT a customer action
      if (!isCustomerAction) {
        // Add a larger delay before logout to prevent UI issues
        setTimeout(() => {
          setCurrentCustomer(null);
          toast.success('Thank you for dining with us!');
        }, 2000);
      }
    }
  }, 0);
};
