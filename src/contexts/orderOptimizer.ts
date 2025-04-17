
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
  // Quick performance check - if empty array, skip processing
  if (items.length === 0) return [];
  
  return items.filter(predicate);
};

/**
 * Debounces an operation to prevent too many updates
 * @param callback Function to debounce
 * @param delay Delay in milliseconds
 */
export const debounce = <T extends (...args: any[]) => any>(callback: T, delay = 300): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

/**
 * Throttles a function to limit how often it can be called
 * @param callback Function to throttle
 * @param limit Time limit in milliseconds
 */
export const throttle = <T extends (...args: any[]) => any>(callback: T, limit = 300): ((...args: Parameters<T>) => void) => {
  let waiting = false;
  let lastArgs: Parameters<T> | null = null;
  
  return (...args: Parameters<T>) => {
    if (waiting) {
      lastArgs = args;
      return;
    }
    
    callback(...args);
    waiting = true;
    
    setTimeout(() => {
      waiting = false;
      if (lastArgs) {
        callback(...lastArgs);
        lastArgs = null;
      }
    }, limit);
  };
};
