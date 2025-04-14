
import { Customer, OrderItem, Order, OrderStatus } from "@/types";
import { toast } from "sonner";

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
  };
  
  console.log("Creating new order:", newOrder);
  setOrders(prev => [...prev, newOrder]);
  setCart([]);  // Clear the cart after ordering
  toast.success('Your order has been placed successfully!');
  
  return newOrder;
};

export const handleUpdateOrderStatus = (
  orderId: string, 
  status: OrderStatus,
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>
) => {
  console.log("Updating order status:", orderId, status);
  
  setOrders(prev => 
    prev.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            status, 
            updatedAt: new Date().toISOString() 
          } 
        : order
    )
  );
  
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
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { 
                ...order, 
                status: 'completed', 
                updatedAt: new Date().toISOString() 
              } 
            : order
        )
      );
      toast.success('Your order has been completed');
    }, 60000); // 60 seconds
  }
};
