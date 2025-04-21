
import { Customer, OrderItem, Order, OrderStatus } from "@/types";
import { toast } from "sonner";
import { optimizeBatchOrderUpdate, throttle, debounce, computeCache, markOrderProcessing, isOrderProcessing, clearProcessingState } from "./orderOptimizer";

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
  // Clear processing state first to ensure cancellation works
  clearProcessingState(orderId);
  
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
  
  // Prevent duplicate updates - global check using shared state
  if (isOrderProcessing(orderId)) {
    console.log("Skipping duplicate update (already processing):", orderId, status);
    toast.error("Please wait, this order is currently being updated", {
      id: `duplicate-${orderId}`
    });
    return;
  }
  
  // Mark this order as being processed to prevent multiple updates
  markOrderProcessing(orderId, 5000); // Prevent clicks for 5 seconds
  
  // Check cache first - don't perform the same update multiple times in a short period
  const cacheKey = `order_update_${orderId}_${status}`;
  if (computeCache.get(cacheKey)) {
    console.log("Skipping duplicate update (cached):", orderId, status);
    toast.error("Please wait, this order was just updated", {
      id: `cached-${orderId}`
    });
    return;
  }
  
  computeCache.set(cacheKey, true, 2000); // Cache for 2 seconds to prevent rapid clicks
  
  // Show visual feedback immediately
  toast.loading(`Updating order to ${status}...`, {
    id: `toast-${orderId}-${status}`,
    duration: 2000
  });
  
  // Perform the update immediately to improve responsiveness
  // First, check if the order exists and if the status change makes sense
  setOrders(prev => {
    const order = prev.find(o => o.id === orderId);
    if (!order) {
      console.error(`Order ${orderId} not found`);
      return prev;
    }
    
    // Verify the status change is valid in the workflow
    const statusFlow: OrderStatus[] = ["pending", "confirmed", "preparing", "ready", "served", "completed"];
    const currentIndex = statusFlow.indexOf(order.status);
    const newIndex = statusFlow.indexOf(status);
    
    if (newIndex <= currentIndex && status !== 'completed') {
      console.error(`Invalid status change from ${order.status} to ${status}`);
      return prev;
    }
    
    console.log(`Valid status change from ${order.status} to ${status} for order ${orderId}`);
    
    // Use optimized batch update
    return optimizeBatchOrderUpdate(prev, orderId, status);
  });
  
  // Show toast notification after a small delay, but don't block the main thread
  setTimeout(() => {
    const statusMessages = {
      'confirmed': 'Order confirmed by waiter',
      'preparing': 'Chef has started preparing your order',
      'ready': 'Your order is ready to be served',
      'served': 'Your order has been served',
      'completed': 'Order completed',
    };
    
    toast.success(statusMessages[status] || `Order status updated to ${status}`, {
      id: `toast-${orderId}-${status}`,
    });
  }, 500);
  
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
};
