
import { Order, OrderStatus } from "@/types";

/**
 * Optimizes order updates by batching them to reduce re-renders
 * @param orders Current orders array
 * @param orderId ID of the order to update
 * @param status New order status
 * @returns Updated orders array
 */
export const optimizeBatchOrderUpdate = (
  orders: Order[],
  orderId: string,
  status: OrderStatus
): Order[] => {
  // Find the order to update first to avoid unnecessary iterations
  const orderToUpdate = orders.find(order => order.id === orderId);
  
  // If order doesn't exist or status is already the same, return original array
  if (!orderToUpdate || orderToUpdate.status === status) {
    return orders;
  }
  
  // Only map through array if we need to make a change
  return orders.map(order => 
    order.id === orderId 
      ? { 
          ...order, 
          status, 
          updatedAt: new Date().toISOString() 
        } 
      : order
  );
};

/**
 * Optimizes operations that involve filtering lists
 * @param items Array to filter
 * @param predicate Filter function
 * @returns Filtered array
 */
export const optimizeFilter = <T>(items: T[], predicate: (item: T) => boolean): T[] => {
  // This could be extended with more optimizations like caching
  return items.filter(predicate);
};
