
import { Customer, OrderItem, Order, OrderStatus } from "@/types";
import { toast } from "sonner";
import { optimizeBatchOrderUpdate, throttle } from "./orderOptimizer";

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
  // Use function to ensure we have the latest state
  setOrders(prev => prev.filter(order => order.id !== orderId));
  toast.success('Order cancelled successfully');
};

// Throttle the status update to prevent rapid consecutive updates
export const handleUpdateOrderStatus = throttle((
  orderId: string, 
  status: OrderStatus,
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>,
  setCurrentCustomer?: React.Dispatch<React.SetStateAction<Customer | null>>
) => {
  console.log("Updating order status:", orderId, status);
  
  // Use our optimized batch update
  setOrders(prev => optimizeBatchOrderUpdate(prev, orderId, status));
  
  const statusMessages = {
    'confirmed': 'Order confirmed by waiter',
    'preparing': 'Chef has started preparing your order',
    'ready': 'Your order is ready to be served',
    'served': 'Your order has been served',
    'completed': 'Order completed',
  };
  
  toast.success(statusMessages[status] || `Order status updated to ${status}`);
  
  // Auto-complete orders after they've been served for a while (60 seconds)
  if (status === 'served') {
    setTimeout(() => {
      setOrders(prev => {
        // First check if the order still exists and is still in served status
        const orderToComplete = prev.find(order => order.id === orderId && order.status === 'served');
        if (!orderToComplete) return prev;
        
        // Use our optimized batch update
        return optimizeBatchOrderUpdate(prev, orderId, 'completed');
      });
      
      toast.success('Your order has been completed');
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
      setTimeout(() => {
        setCurrentCustomer(null);
        toast.success('Thank you for dining with us!');
      }, 1500);
    }
  }
}, 300);
