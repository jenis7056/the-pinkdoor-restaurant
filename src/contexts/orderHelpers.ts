import { Customer, OrderItem, Order, OrderStatus } from "@/types";
import { toast } from "sonner";
import { 
  optimizeBatchOrderUpdate, 
  throttle, 
  debounce, 
  computeCache, 
  markOrderProcessing, 
  isOrderProcessing, 
  clearProcessingState,
  persistentOrderStore
} from "./orderOptimizer";
import { printReceipt } from "@/utils/receiptGenerator";

// Track recent operations to prevent duplicates
const recentOperations = new Map<string, number>();

// Helper to prevent duplicate operations
function preventDuplicateOperation(key: string, timeWindowMs: number = 2000): boolean {
  const now = Date.now();
  const lastTime = recentOperations.get(key) || 0;
  
  if (now - lastTime < timeWindowMs) {
    console.log(`Duplicate operation prevented: ${key}`);
    return false;
  }
  
  recentOperations.set(key, now);
  return true;
}

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
  
  // Prevent duplicate order creation
  const orderKey = `order-create-${currentCustomer.id}-${Date.now()}`;
  if (!preventDuplicateOperation(orderKey)) {
    toast.error('Please wait, your previous order is being processed');
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
  
  // Add order to persistent store first
  persistentOrderStore.setOrder(newOrder);
  
  // Use functional update to avoid stale state
  setOrders(prev => {
    // Make sure we aren't adding duplicate orders
    const orderExists = prev.some(order => order.id === newOrder.id);
    if (orderExists) {
      return prev;
    }
    return [...prev, newOrder];
  });
  
  setCart([]); // Clear the cart after ordering
  
  toast.success('Your order has been placed successfully!', {
    id: `order-success-${newOrder.id}`, // Prevent duplicate toasts
  });
  
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
  // Prevent duplicate cancels
  const cancelKey = `cancel-${orderId}`;
  if (!preventDuplicateOperation(cancelKey, 5000)) {
    toast.error('Please wait, your cancellation is being processed');
    return;
  }
  
  // Clear processing state first to ensure cancellation works
  clearProcessingState(orderId);
  
  // Remove from persistent store
  persistentOrderStore.removeOrder(orderId);
  
  // Use optimized approach to filter - more efficient than map+filter
  setOrders(prev => prev.filter(order => order.id !== orderId));
  
  toast.success('Order cancelled successfully', {
    id: `cancel-success-${orderId}`, // Prevent duplicate toasts
  });
};

export const handleUpdateOrderStatus = (
  orderId: string, 
  status: OrderStatus,
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>,
  setCurrentCustomer?: React.Dispatch<React.SetStateAction<Customer | null>>
) => {
  console.log("Updating order status:", orderId, status);
  
  // Create a unique key for this specific update operation
  const updateKey = `update-${orderId}-${status}-${Date.now()}`;
  
  // Prevent duplicate updates with status-specific throttling
  if (!preventDuplicateOperation(updateKey, 1000)) { // Reduced from 2000ms to 1000ms
    console.log(`Prevented duplicate status update for ${orderId}`);
    return;
  }
  
  // Prevent duplicate updates - global check using shared state
  if (isOrderProcessing(orderId)) {
    console.log("Skipping duplicate update (already processing):", orderId, status);
    return;
  }
  
  // For completed status, use shorter processing time to improve responsiveness
  const processingTime = status === 'completed' ? 1500 : 3000;
  
  // Mark this order as being processed to prevent multiple updates
  markOrderProcessing(orderId, processingTime);
  
  // Check cache first - don't perform the same update multiple times in a short period
  const cacheKey = `order_update_${orderId}_${status}`;
  if (computeCache.get(cacheKey)) {
    console.log("Skipping duplicate update (cached):", orderId, status);
    return;
  }
  
  // Use shorter cache time for completed status
  const cacheTime = status === 'completed' ? 1000 : 2000;
  computeCache.set(cacheKey, true, cacheTime);
  
  // Show visual feedback immediately with a unique ID to prevent duplicate toasts
  const toastId = `toast-${orderId}-${status}-${Date.now()}`;
  
  // For completed status, skip loading toast to improve performance
  if (status !== 'completed') {
    toast.loading(`Updating order to ${status}...`, {
      id: toastId,
      duration: 2000
    });
  }
  
  // First, check if the order exists in the persistent store
  const storedOrder = persistentOrderStore.getOrder(orderId);
  
  // Optimize state updates by using a callback function
  const updateOrdersState = () => {
    // Perform the update immediately to improve responsiveness
    setOrders(prev => {
      // Recover the order from persistent store if it's missing from state
      if (!prev.some(o => o.id === orderId) && storedOrder) {
        console.log(`Recovered order ${orderId} from persistent store`);
        prev = [...prev, storedOrder];
      }
      
      const order = prev.find(o => o.id === orderId);
      if (!order) {
        console.error(`Order ${orderId} not found`);
        return prev;
      }
      
      // Skip update if the status is already set (idempotent operation)
      if (order.status === status) {
        console.log(`Order ${orderId} already has status ${status}, skipping update`);
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
      const updatedOrders = optimizeBatchOrderUpdate(prev, orderId, status);
      
      // Update the persistent store with the new order state
      const updatedOrder = updatedOrders.find(o => o.id === orderId);
      if (updatedOrder) {
        persistentOrderStore.setOrder(updatedOrder);
      }
      
      return updatedOrders;
    });
  };
  
  // Execute state update with optimized timing
  if (status === 'served') {
    // For served status, use immediate update for better responsiveness
    updateOrdersState();
    
    // Attempt to print receipt
    setTimeout(async () => {
      // Use setOrders to get the current state of orders to find the order
      setOrders(currentOrders => {
        const order = currentOrders.find(o => o.id === orderId);
        if (order) {
          // Print receipt using the found order
          printReceipt(order).then(printed => {
            if (printed) {
              toast.success('Receipt printed successfully');
            } else {
              toast.error('Failed to print receipt. Please check printer connection.');
            }
          });
        }
        return currentOrders; // Return unchanged orders
      });
    }, 100);
    
    // Show success toast after state has been updated
    setTimeout(() => {
      toast.success('Order served successfully', {
        id: toastId,
      });
    }, 100);
  } else {
    // For other statuses, use small delay to ensure UI responsiveness
    updateOrdersState();
    
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
        id: toastId,
      });
    }, 500);
  }
  
  // Only auto-complete served orders if they're not already completed
  // and when they were served more than 1 minute ago
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
      
      // Update persistent store
      const storedOrder = persistentOrderStore.getOrder(orderId);
      if (storedOrder && storedOrder.status === 'served') {
        persistentOrderStore.setOrder({
          ...storedOrder,
          status: 'completed',
          updatedAt: new Date().toISOString()
        });
      }
      
      toast.success('Your order has been completed', {
        id: `auto-complete-${orderId}`,
      });
    }, 60000); // 60 seconds
  }
  
  // Only logout customer when admin manually completes the order from admin panel
  // and make sure we prevent logout for newly completed orders by customer
  if (status === 'completed' && setCurrentCustomer) {
    // Check if this is an admin/staff action or a customer action
    const isCustomerAction = document.location.pathname.includes('/customer');
    
    // Only trigger the auto-logout if this is NOT a customer action
    if (!isCustomerAction) {
      // Use shorter delay for logout to improve responsiveness
      setTimeout(() => {
        setCurrentCustomer(null);
        toast.success('Thank you for dining with us!', {
          id: `logout-${orderId}`,
        });
      }, 1000); // Reduced from 2000ms
    }
  }
};

// Function to clean up stale operation records
// Can be called periodically to prevent memory leaks
export function cleanupOperationsCache() {
  const now = Date.now();
  const staleThreshold = 60 * 60 * 1000; // 1 hour
  
  recentOperations.forEach((timestamp, key) => {
    if (now - timestamp > staleThreshold) {
      recentOperations.delete(key);
    }
  });
}

// Set up automatic cleanup every hour
setInterval(cleanupOperationsCache, 3600000);

/**
 * Recover any lost orders from the persistent store
 * @param setOrders setState function for orders
 */
export const recoverLostOrders = (
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>
) => {
  const persistentOrders = persistentOrderStore.getAllOrders();
  if (persistentOrders.length === 0) return;
  
  console.log(`Attempting to recover ${persistentOrders.length} orders from persistent store`);
  
  setOrders(prev => {
    // Filter out orders that already exist in the state
    const missingOrders = persistentOrders.filter(
      persistentOrder => !prev.some(stateOrder => stateOrder.id === persistentOrder.id)
    );
    
    if (missingOrders.length === 0) {
      return prev;
    }
    
    console.log(`Recovered ${missingOrders.length} missing orders`);
    return [...prev, ...missingOrders];
  });
};
